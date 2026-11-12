from datetime import datetime, time, timedelta, timezone
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import CITY_TZ, settings
from app.database import get_db
from app.main import app
from app.models import Base, Event
from app.seed import EVENTS, seed

BACKEND_DIR = Path(__file__).resolve().parents[1]

engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


@pytest.fixture()
def tables():
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)


@pytest.fixture()
def client(tables):
    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def event_payload(**overrides):
    payload = {
        "title": "Симфония тайги",
        "category": "Концерт",
        "description": "Большой симфонический концерт в городской филармонии.",
        "venue": "Сургутская филармония",
        "address": "Сургут, улица Энгельса, 18",
        "starts_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "price": 1200,
        "image_url": "/events/stitch-01.jpg",
        "age_limit": "6+",
    }
    payload.update(overrides)
    return payload


def titles(response):
    assert response.status_code == 200
    return [event["title"] for event in response.json()]


def test_list_get_create_update_delete_event(client):
    created = client.post("/api/events", json=event_payload())
    assert created.status_code == 201
    event_id = created.json()["id"]

    assert client.get("/api/events").json()[0]["title"] == "Симфония тайги"
    assert client.get(f"/api/events/{event_id}").status_code == 200
    updated = client.put(f"/api/events/{event_id}", json=event_payload(title="Новая симфония"))
    assert updated.status_code == 200
    assert updated.json()["title"] == "Новая симфония"
    assert client.delete(f"/api/events/{event_id}").status_code == 204
    assert client.get(f"/api/events/{event_id}").status_code == 404


def test_missing_event_returns_404(client):
    response = client.get("/api/events/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Событие не найдено"


def test_invalid_event_is_rejected(client):
    response = client.post("/api/events", json=event_payload(title="x", price=-1, age_limit="5+"))
    assert response.status_code == 422


def test_whitespace_only_fields_are_rejected_and_values_trimmed(client):
    assert client.post("/api/events", json=event_payload(title="   ")).status_code == 422
    created = client.post("/api/events", json=event_payload(title="  Джазовый вечер  "))
    assert created.status_code == 201
    assert created.json()["title"] == "Джазовый вечер"


def test_starts_at_is_stored_as_utc_and_returned_with_offset(client):
    aware = client.post("/api/events", json=event_payload(starts_at="2030-06-01T19:00:00+05:00"))
    assert datetime.fromisoformat(aware.json()["starts_at"]) == datetime(2030, 6, 1, 14, 0, tzinfo=timezone.utc)

    # Дата без смещения — местное время Сургута, а не UTC сервера.
    naive = client.post("/api/events", json=event_payload(starts_at="2030-06-01T19:00:00"))
    returned = datetime.fromisoformat(naive.json()["starts_at"])
    assert returned.tzinfo is not None
    assert returned.astimezone(CITY_TZ).replace(tzinfo=None) == datetime(2030, 6, 1, 19, 0)

    # Повторное сохранение без изменений не сдвигает время.
    event_id = naive.json()["id"]
    resaved = client.put(f"/api/events/{event_id}", json=event_payload(starts_at=naive.json()["starts_at"]))
    assert datetime.fromisoformat(resaved.json()["starts_at"]) == returned


def test_search_treats_like_wildcards_literally(client):
    client.post("/api/events", json=event_payload(title="Скидка 100% на абонемент"))
    client.post("/api/events", json=event_payload(title="Обычный концерт"))
    assert titles(client.get("/api/events", params={"q": "100%"})) == ["Скидка 100% на абонемент"]
    assert titles(client.get("/api/events", params={"q": "%"})) == ["Скидка 100% на абонемент"]
    assert titles(client.get("/api/events", params={"q": "_"})) == []


def test_date_filters_use_city_calendar_days(client):
    # Оба события 1 июня по UTC, но по времени Сургута — в разные дни.
    client.post("/api/events", json=event_payload(title="Поздний вечер", starts_at="2030-06-01T23:30:00+05:00"))
    client.post("/api/events", json=event_payload(title="После полуночи", starts_at="2030-06-02T00:30:00+05:00"))
    june_1 = {"date_from": "2030-06-01", "date_to": "2030-06-01"}
    june_2 = {"date_from": "2030-06-02", "date_to": "2030-06-02"}
    assert titles(client.get("/api/events", params=june_1)) == ["Поздний вечер"]
    assert titles(client.get("/api/events", params=june_2)) == ["После полуночи"]


def test_category_filter_ignores_all_events_label(client):
    client.post("/api/events", json=event_payload(title="Концерт", category="Концерт"))
    client.post("/api/events", json=event_payload(title="Спектакль", category="Театр"))
    assert titles(client.get("/api/events", params={"category": "Театр"})) == ["Спектакль"]
    assert len(titles(client.get("/api/events", params={"category": "Все события"}))) == 2


def test_health_and_readiness(client):
    assert client.get("/health").json() == {"status": "ok"}
    assert client.get("/ready").json() == {"status": "ready", "database": "ok"}


def test_readiness_returns_503_when_database_is_unavailable(client):
    broken_session = sessionmaker(bind=create_engine("sqlite:////nonexistent-dir/afisha.db"))

    def broken_db():
        db = broken_session()
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = broken_db
    response = client.get("/ready")
    assert response.status_code == 503
    assert response.json() == {"status": "unavailable", "database": "error"}


def test_metrics_use_route_templates_instead_of_raw_paths(client):
    event_id = client.post("/api/events", json=event_payload()).json()["id"]
    client.get(f"/api/events/{event_id}")
    client.get("/api/events/987654")
    client.get("/wp-login.php")
    metrics = client.get("/metrics").text
    assert 'path="/api/events/{event_id}"' in metrics
    assert f'path="/api/events/{event_id}"' not in metrics
    assert 'path="/api/events/987654"' not in metrics
    assert 'path="/wp-login.php"' not in metrics
    assert 'path="unmatched"' in metrics


def test_seed_fills_only_empty_database_with_evening_events(tables):
    assert seed(TestingSession) == len(EVENTS)
    with TestingSession() as db:
        events = db.scalars(select(Event).order_by(Event.starts_at)).all()
        local_starts = [event.starts_at.replace(tzinfo=timezone.utc).astimezone(CITY_TZ) for event in events]
        assert {start.time() for start in local_starts} == {time(19, 0)}
        assert local_starts[0].date() == datetime.now(CITY_TZ).date() + timedelta(days=3)
        db.delete(events[0])
        db.commit()

    # Повторный запуск (рестарт контейнера) не возвращает удалённое событие и не создаёт дублей.
    assert seed(TestingSession) == 0
    with TestingSession() as db:
        assert db.scalar(select(func.count()).select_from(Event)) == len(EVENTS) - 1


def test_alembic_accepts_percent_encoded_password(monkeypatch):
    monkeypatch.setattr(settings, "database_url", "postgresql+psycopg://afisha:p%40ss%25word@localhost:5432/afisha")
    config = Config()  # без alembic.ini: fileConfig не перенастраивает логирование процесса pytest
    config.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
    command.upgrade(config, "head", sql=True)  # офлайн-режим: SQL без подключения к базе
