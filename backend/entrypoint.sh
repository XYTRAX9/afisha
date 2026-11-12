#!/bin/sh
set -eu

attempt=1
until alembic upgrade head; do
  if [ "$attempt" -ge 12 ]; then
    echo "Database migration failed after $attempt attempts; backend will not start." >&2
    exit 1
  fi
  echo "Database is not ready (attempt $attempt/12); retrying in 3 seconds..."
  attempt=$((attempt + 1))
  sleep 3
done
python -m app.seed
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
