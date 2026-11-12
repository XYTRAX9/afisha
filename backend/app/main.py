import time
from datetime import date, datetime, time as datetime_time, timedelta, timezone
from zoneinfo import ZoneInfo

from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Gauge, Histogram, generate_latest
from sqlalchemy import Select, func, or_, select, text
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Event
from app.schemas import EventCreate, EventRead, EventUpdate

app = FastAPI(title="Афиша API", version="1.0.0", description="Городская афиша культурных событий")
CITY_TZ = ZoneInfo("Asia/Yekaterinburg")
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


@app.middleware("http")
async def observe_requests(request, call_next):
    path = request.url.path
    if path == "/metrics":
        return await call_next(request)
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
    db.execute(text("SELECT 1"))
    return {"status": "ready", "database": "ok"}


@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


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
        term = f"%{q.strip()}%"
        query = query.where(or_(Event.title.ilike(term), Event.description.ilike(term), Event.venue.ilike(term)))
    if category and category != "Все события":
        query = query.where(Event.category == category)
    if date_from:
        query = query.where(Event.starts_at >= datetime.combine(date_from, datetime_time.min, tzinfo=CITY_TZ))
    if date_to:
        query = query.where(Event.starts_at < datetime.combine(date_to + timedelta(days=1), datetime_time.min, tzinfo=CITY_TZ))
    return list(db.scalars(query.order_by(Event.starts_at)).all())


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
