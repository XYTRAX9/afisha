import logging
import time
from datetime import date, datetime, time as datetime_time, timedelta, timezone

from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Gauge, Histogram, generate_latest
from sqlalchemy import Select, or_, select, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from starlette.routing import Match

from app.config import CITY_TZ, settings
from app.database import get_db
from app.models import Event
from app.schemas import EventCreate, EventRead, EventUpdate

logger = logging.getLogger("afisha")

app = FastAPI(title="Афиша API", version="1.0.0", description="Городская афиша культурных событий")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

REQUESTS = Counter("http_requests_total", "HTTP requests", ["method", "path", "status"])
LATENCY = Histogram("http_request_duration_seconds", "HTTP request duration", ["method", "path"])
IN_PROGRESS = Gauge("http_requests_in_progress", "Requests currently being processed")
UNMATCHED_PATH = "unmatched"


def route_template(request: Request) -> str:
    """Шаблон маршрута для метки `path`: /api/events/{event_id}, а не /api/events/42.

    Сырой путь давал отдельный временной ряд на каждый id и на каждый случайный URL
    сканеров (а приложение публикуется через ngrok), из-за чего память backend и
    Prometheus росла без ограничений.
    """
    partial = None
    for route in app.router.routes:
        match, _ = route.matches(request.scope)
        if match == Match.FULL:
            return getattr(route, "path", UNMATCHED_PATH)
        if match == Match.PARTIAL and partial is None:
            partial = getattr(route, "path", None)  # путь совпал, метод нет (405)
    return partial or UNMATCHED_PATH


@app.middleware("http")
async def observe_requests(request: Request, call_next):
    if request.url.path == "/metrics":
        return await call_next(request)
    path = route_template(request)
    started = time.perf_counter()
    IN_PROGRESS.inc()
    status = 500
    try:
        response = await call_next(request)
        status = response.status_code
        return response
    finally:
        IN_PROGRESS.dec()
        REQUESTS.labels(request.method, path, str(status)).inc()
        LATENCY.labels(request.method, path).observe(time.perf_counter() - started)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/ready")
def ready(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError as error:
        # 503 вместо необработанного исключения: без трейсбека в логах на каждый healthcheck.
        logger.warning("Readiness check failed: %s", error.__class__.__name__)
        return JSONResponse(status_code=503, content={"status": "unavailable", "database": "error"})
    return {"status": "ready", "database": "ok"}


@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


def city_day_start(day: date) -> datetime:
    """Начало календарного дня по времени Сургута, в UTC — как даты хранятся в базе."""
    return datetime.combine(day, datetime_time.min, tzinfo=CITY_TZ).astimezone(timezone.utc)


@app.get("/api/events", response_model=list[EventRead])
def list_events(
    q: str | None = Query(default=None, max_length=120),
    category: str | None = Query(default=None, max_length=60),
    date_from: date | None = None,
    date_to: date | None = None,
    db: Session = Depends(get_db),
):
    query: Select = select(Event)
    if q and q.strip():
        term = q.strip()
        # autoescape: «%» и «_» в запросе ищутся буквально, а не как шаблоны LIKE.
        query = query.where(or_(
            Event.title.icontains(term, autoescape=True),
            Event.description.icontains(term, autoescape=True),
            Event.venue.icontains(term, autoescape=True),
        ))
    if category and category != "Все события":
        query = query.where(Event.category == category)
    if date_from:
        query = query.where(Event.starts_at >= city_day_start(date_from))
    if date_to:
        query = query.where(Event.starts_at < city_day_start(date_to + timedelta(days=1)))
    return list(db.scalars(query.order_by(Event.starts_at, Event.id)).all())


@app.get("/api/events/{event_id}", response_model=EventRead)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.get(Event, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Событие не найдено")
    return event


@app.post("/api/events", response_model=EventRead, status_code=201)
def create_event(payload: EventCreate, db: Session = Depends(get_db)):
    event = Event(**payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@app.put("/api/events/{event_id}", response_model=EventRead)
def update_event(event_id: int, payload: EventUpdate, db: Session = Depends(get_db)):
    event = db.get(Event, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Событие не найдено")
    for key, value in payload.model_dump().items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event


@app.delete("/api/events/{event_id}", status_code=204)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.get(Event, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Событие не найдено")
    db.delete(event)
    db.commit()
