# Афиша Сургута

MVP культурной афиши: события хранятся в PostgreSQL, FastAPI предоставляет CRUD API, Vue 3 показывает афишу и позволяет искать, фильтровать, создавать, редактировать и удалять события.

Визуальная основа — предоставленный Google Stitch экспорт `stitch_afisha_cultural_events_platform/`: главная `_5`, экран поиска/каталога `_16`, детали события `_9` и дизайн-токены в `DESIGN.md`. Исходный экспорт оставлен в репозитории без изменений.

## Архитектура

```mermaid
flowchart LR
  Browser[Браузер] -->|HTTP :8080| Nginx[Frontend Nginx<br/>Vue SPA]
  Nginx -->|/api/*| API[FastAPI backend]
  API -->|SQL / внутренняя сеть| DB[(PostgreSQL 16)]
  Prometheus[Prometheus] -->|/metrics| API
  Grafana[Grafana] --> Prometheus
  Nginx -. SPA fallback .-> Browser
```

Backend и PostgreSQL соединены изолированной Docker-сетью; frontend и monitoring находятся в прикладной сети. Снаружи опубликован только HTTP-порт frontend, Prometheus и Grafana доступны локально на `127.0.0.1`.

## Стек и структура

- Backend: Python 3.12, FastAPI, SQLAlchemy 2, PostgreSQL 16, Alembic, Prometheus client.
- Frontend: Vue 3 Composition API, TypeScript, Vite, Nginx unprivileged.
- Запуск: Docker Compose, Prometheus, Grafana.

```text
backend/       API, модели, миграция, идемпотентные демоданные, тесты
frontend/      SPA Vue, API-клиент, компоненты афиши и страницы события
deploy/        Prometheus и Grafana provisioning/dashboard
docs/ngrok.md  инструкция для временной публикации
compose.yaml   вся система
stitch_.../    предоставленный экспорт Google Stitch
```

## Запуск

Нужны Docker Engine/Desktop с Compose v2. Скопируйте демонстрационную конфигурацию и задайте локальные пароли:

```sh
cp .env.example .env
# замените POSTGRES_PASSWORD и GRAFANA_PASSWORD в .env
docker compose up --build -d
```

При запуске backend ждёт готовности PostgreSQL, до 12 раз повторяет запуск миграции Alembic и останавливается, если миграция не проходит. После миграции загружаются демоданные; повторный запуск не создаёт повторные события с теми же названиями. FastAPI стартует после успешной миграции.

Frontend: <http://localhost:8080>  
API: <http://localhost:8080/api/events>  
Swagger: <http://localhost:8080/docs>  
Liveness: <http://localhost:8080/health>  
Readiness с PostgreSQL: <http://localhost:8080/ready>  
Метрики: <http://localhost:8080/metrics>  
Prometheus: <http://127.0.0.1:9090>  
Grafana: <http://127.0.0.1:3000> (учётные данные из `.env`, по умолчанию `admin`)

Vite в режиме разработки использует относительный путь `/api` и проксирует его в локально запущенный backend на `localhost:8000`. Для Docker frontend проксирует `/api` в сервис `backend` через внутреннюю сеть.

## API

- `GET /api/events?q=...&category=...&date_from=YYYY-MM-DD&date_to=YYYY-MM-DD` — список, поиск и фильтры.
- `GET /api/events/{id}` — событие.
- `POST /api/events` — создать.
- `PUT /api/events/{id}` — изменить.
- `DELETE /api/events/{id}` — удалить.

Форма проверяет обязательные поля браузером и отправляет типизированный JSON; backend выполняет повторную валидацию Pydantic.

## Мониторинг

Prometheus опрашивает `/metrics` FastAPI раз в 15 секунд. Метрики учитывают число HTTP-запросов по методу, пути и статусу, длительность, число запросов в обработке; `up` показывает доступность backend. Readiness проверяет соединение с PostgreSQL. В Grafana автоматически настраивается datasource Prometheus и дашборд с RPS, 4xx/5xx, p50/p95 latency и доступностью backend.

## Тесты и диагностика

Тесты API используют изолированную SQLite in-memory базу и не требуют отдельного PostgreSQL:

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
cd backend && python -m pytest
```

Сборка production frontend: `cd frontend && npm ci && npm run build`.  
Состояние и healthcheck: `docker compose ps`.  
Логи: `docker compose logs -f backend frontend db`.  
Текущая версия миграций: `docker compose exec backend alembic current`.

Для сброса **всей** тестовой БД и связанных сохранённых данных используйте `docker compose down -v`, затем `docker compose up --build -d`. Команда удалит также данные Prometheus и Grafana.

## ngrok

Инструкция установки токена, запуска и остановки туннеля находится в [docs/ngrok.md](docs/ngrok.md). Туннель направляется только на опубликованный frontend-порт.

## Перенос дизайна и границы MVP

Перенесены редакционная шапка и навигация, тёплый бумажный фон, Manrope, терракотовый акцент, фильтры-чипы, подборки, карточки афиши с фотографией/категорией/датой/площадкой/ценой и мобильная сетка. Детали события следуют экрану Stitch `_9` по композиции, колонке афиши, иерархии заголовка и метаданным.

Экспорт Stitch показывает также оплату и выбор мест, личный кабинет, возвраты, отзывы, избранное и рассылку. Это за пределами CRUD MVP: неактивные элементы не обещают неподдерживаемые действия. Формы управления событиями и их подтверждение удаления добавлены как обязательный интерфейс MVP. Изображения редакционного экспорта локализованы в frontend; реальные билеты, аккаунты, избранное, оплата, подписка и авторизация отсутствуют.

## Безопасность и ограничения

- CRUD не защищён авторизацией и предназначен только для локальной демонстрации.
- Не добавляйте `.env`, пароли или ngrok token в Git. В Compose наружу не опубликованы backend и PostgreSQL.
- Для внешнего показа используйте временный туннель и отключайте его сразу после демонстрации.
- Демо пароли в `.env.example` не предназначены для production.
- В карточках есть операции редактирования и удаления, поскольку у MVP нет аккаунтов и ролей.
# afisha
# afisha
