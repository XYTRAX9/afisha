from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import get_db
from app.main import app
from app.models import Base

engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


@pytest.fixture()
def client():
    Base.metadata.create_all(engine)
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
    Base.metadata.drop_all(engine)


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


def test_health_and_readiness(client):
    assert client.get("/health").json() == {"status": "ok"}
    assert client.get("/ready").json() == {"status": "ready", "database": "ok"}
