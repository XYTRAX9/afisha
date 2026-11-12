from zoneinfo import ZoneInfo

from pydantic_settings import BaseSettings, SettingsConfigDict

# Афиша городская: дни в фильтрах и даты без смещения трактуются по времени Сургута.
# В базе даты хранятся в UTC.
CITY_TZ = ZoneInfo("Asia/Yekaterinburg")


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://afisha:afisha@db:5432/afisha"
    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
