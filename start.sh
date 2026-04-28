#!/bin/bash
set -e

cd backend
python manage.py migrate --noinput
python manage.py collectstatic --noinput
exec gunicorn backend.wsgi --bind 0.0.0.0:$PORT --workers 4 --threads 2

