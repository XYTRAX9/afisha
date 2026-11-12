from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class EventBase(BaseModel):
    title: str = Field(min_length=2, max_length=180)
    category: str = Field(min_length=2, max_length=60)
    description: str = Field(min_length=10, max_length=5000)
    venue: str = Field(min_length=2, max_length=180)
    address: str = Field(min_length=2, max_length=240)
    starts_at: datetime
    price: int = Field(ge=0, le=10_000_000)
    image_url: str = Field(default="", max_length=600)
    age_limit: str = Field(default="0+", pattern=r"^(0|6|12|16|18)\+$")


class EventCreate(EventBase):
    pass


class EventUpdate(EventBase):
    pass


class EventRead(EventBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
