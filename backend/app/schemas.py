from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.config import CITY_TZ


class EventBase(BaseModel):
    # Пробелы по краям обрезаются до проверки длины: название из одних пробелов не пройдёт.
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=2, max_length=180)
    category: str = Field(min_length=2, max_length=60)
    description: str = Field(min_length=10, max_length=5000)
    venue: str = Field(min_length=2, max_length=180)
    address: str = Field(min_length=2, max_length=240)
    starts_at: datetime
    price: int = Field(ge=0, le=10_000_000)
    image_url: str = Field(default="", max_length=600)
    age_limit: str = Field(default="0+", pattern=r"^(0|6|12|16|18)\+$")


class EventWrite(EventBase):
    @field_validator("starts_at")
    @classmethod
    def starts_at_to_utc(cls, value: datetime) -> datetime:
        # Дата без смещения (например, из Swagger) — это местное время Сургута, а не UTC сервера.
        if value.tzinfo is None:
            value = value.replace(tzinfo=CITY_TZ)
        return value.astimezone(timezone.utc)


class EventCreate(EventWrite):
    pass


class EventUpdate(EventWrite):
    pass


class EventRead(EventBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("starts_at", "created_at", "updated_at")
    @classmethod
    def ensure_timezone(cls, value: datetime) -> datetime:
        # В базе даты в UTC. PostgreSQL возвращает их со смещением, SQLite — без;
        # без смещения браузер прочитал бы дату как локальное время.
        return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value
