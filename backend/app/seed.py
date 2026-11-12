from collections.abc import Callable
from datetime import datetime, time, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import CITY_TZ
from app.database import SessionLocal
from app.models import Event

POSTERS = [f"/events/stitch-{index:02d}.jpg" for index in range(1, 9)]
EVENING = time(19, 0)

EVENTS = [
    ("Симфония тайги: Шедевры Рахманинова", "Концерт", "Большой симфонический вечер в исполнении оркестра Сургутской филармонии.", "Сургутская филармония", 1200, "6+"),
    ("Гроза. Голоса прибрежного города", "Театр", "Новая сценическая версия пьесы Александра Островского о свободе и выборе.", "Сургутский муздрамтеатр", 800, "16+"),
    ("Северный горизонт: графика Югры", "Выставка", "Коллекция современной графики и живописи художников Севера.", "Культурный центр «Порт»", 0, "0+"),
    ("Великий маг кино: классика мирового экрана", "Кино", "Киноклуб приглашает на специальный показ и разговор о языке кино.", "Кинотеатр «Галактика»", 400, "12+"),
    ("Сказка «Тайна ледяного кристалла»", "Детям", "Интерактивный спектакль для всей семьи на сцене театра кукол.", "Театр актёра и куклы «Петрушка»", 450, "0+"),
    ("Джазовый вечер: огни большого города", "Концерт", "Камерная программа джазового трио в уютном малом зале.", "Малый зал филармонии", 900, "12+"),
    ("Сибирский пейзаж: архитектура цвета", "Мастер-класс", "Практическое занятие по живописи с местным художником.", "Сургутский художественный музей", 1500, "16+"),
    ("Мастер-класс «Керамика Севера»", "Мастер-класс", "Познакомьтесь с традициями керамики и создайте собственную работу.", "Культурный центр «Порт»", 900, "12+"),
]


def seed(session_factory: Callable[[], Session] = SessionLocal) -> int:
    """Загружает демо-события, только если таблица пуста. Возвращает число добавленных событий.

    Раньше недостающие события досоздавались по названию при каждом старте контейнера,
    и удалённые или переименованные пользователем демо-события возвращались после рестарта.
    """
    with session_factory() as db:
        if db.scalar(select(func.count()).select_from(Event)):
            return 0
        today = datetime.now(CITY_TZ).date()
        for index, (title, category, description, venue, price, age_limit) in enumerate(EVENTS):
            # Вечерний сеанс в 19:00 по Сургуту через 3, 5, 7… дней (а не «сейчас + 19 часов»).
            starts_at = datetime.combine(today + timedelta(days=3 + index * 2), EVENING, tzinfo=CITY_TZ)
            db.add(Event(
                title=title,
                category=category,
                description=description,
                venue=venue,
                address="Сургут, ХМАО-Югра",
                starts_at=starts_at.astimezone(timezone.utc),
                price=price,
                image_url=POSTERS[index],
                age_limit=age_limit,
            ))
        db.commit()
        return len(EVENTS)


if __name__ == "__main__":
    added = seed()
    print(f"Демоданные: добавлено событий — {added}." if added else "Демоданные: в базе уже есть события, загрузка пропущена.")
