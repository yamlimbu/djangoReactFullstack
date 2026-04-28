# Migration & Setup Instructions

## Step 1: Update Django Settings

Replace your current `backend/backend/settings.py` with the new comprehensive settings:

```bash
# Backup current settings
cp backend/backend/settings.py backend/backend/settings_backup.py

# Copy new settings
cp backend/backend/settings_complete.py backend/backend/settings.py
```

## Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 3: Create Migrations

```bash
cd backend

# Create migrations for all new models
python manage.py makemigrations api

# Apply migrations
python manage.py migrate
```

## Step 4: Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

## Step 5: Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3
# For PostgreSQL: postgresql://user:password@localhost:5432/yt_analytics

# YouTube API
YOUTUBE_API_KEY=your-youtube-api-key-here

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379/0

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Sentry (optional)
SENTRY_DSN=
```

## Step 6: Create Logs Directory

```bash
mkdir -p backend/logs
```

## Step 7: Collect Static Files (Production)

```bash
python manage.py collectstatic --noinput
```

## Step 8: Run Development Servers

### Terminal 1 - Backend
```bash
cd backend
python manage.py runserver
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## Step 9: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/api/schema/swagger-ui/

## Step 10: Test the API

### Register a new user
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password_confirm": "testpass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

## Troubleshooting

### Issue: ModuleNotFoundError
**Solution**: Ensure all dependencies are installed
```bash
pip install -r requirements.txt
```

### Issue: Database connection error
**Solution**: Check DATABASE_URL in .env file
```bash
# For SQLite (default)
DATABASE_URL=sqlite:///db.sqlite3

# For PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/yt_analytics
```

### Issue: YouTube API key not working
**Solution**: 
1. Go to Google Cloud Console
2. Create a new project
3. Enable YouTube Data API v3
4. Create an API key
5. Add it to .env file

### Issue: CORS errors
**Solution**: Add your frontend URL to CORS_ALLOWED_ORIGINS in .env

### Issue: Port already in use
**Solution**: 
```bash
# For port 8000
python manage.py runserver 8001

# For port 5173
npm run dev -- --port 5174
```

## Database Backup

### Backup SQLite database
```bash
cp backend/db.sqlite3 backend/db.sqlite3.backup
```

### Backup PostgreSQL database
```bash
pg_dump -U username -d yt_analytics > backup.sql
```

## Production Deployment

### Update settings for production
```env
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Run with Gunicorn
```bash
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### Run with Docker
```bash
docker-compose up -d
```

## Celery Setup (Optional - for background tasks)

### Start Celery worker
```bash
celery -A backend worker -l info
```

### Start Celery beat (scheduler)
```bash
celery -A backend beat -l info
```

## Testing

### Run tests
```bash
python manage.py test api
```

### Run with coverage
```bash
coverage run --source='.' manage.py test api
coverage report
```

## Monitoring

### Check API health
```bash
curl http://localhost:8000/api/health/
```

### View system logs
```bash
tail -f backend/logs/django.log
```

## Common Commands

### Create a new app
```bash
python manage.py startapp myapp
```

### Create migrations
```bash
python manage.py makemigrations
```

### Apply migrations
```bash
python manage.py migrate
```

### Create superuser
```bash
python manage.py createsuperuser
```

### Collect static files
```bash
python manage.py collectstatic
```

### Run shell
```bash
python manage.py shell
```

### Flush database
```bash
python manage.py flush
```

## Performance Optimization

### Enable caching
```python
# In settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### Database optimization
```bash
# Create indexes
python manage.py sqlsequencereset api | python manage.py dbshell
```

### Frontend optimization
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Monitoring & Logging

### View Django logs
```bash
tail -f backend/logs/django.log
```

### View API usage
```bash
curl http://localhost:8000/api/api-usage/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### View system logs
```bash
curl http://localhost:8000/api/system-logs/ \
  -H "Authorization: Token YOUR_TOKEN"
```

## Backup & Recovery

### Backup database
```bash
python manage.py dumpdata > backup.json
```

### Restore database
```bash
python manage.py loaddata backup.json
```

## Next Steps

1. ✅ Complete all setup steps above
2. ✅ Test API endpoints
3. ✅ Configure YouTube API key
4. ✅ Set up email notifications
5. ✅ Configure Redis for caching
6. ✅ Set up Celery for background tasks
7. ✅ Deploy to production
8. ✅ Set up monitoring and alerts

---

**Setup Complete! Your YouTube Analytics Platform is ready to use.**
