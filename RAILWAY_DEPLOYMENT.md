# 🚂 Railway Deployment Guide

Complete step-by-step guide to deploy your Django + React app on Railway with PostgreSQL database migration.

---

## 📋 What Changed (Files Updated)

| File | Change |
|------|--------|
| `backend/Procfile` | `gunicorn` instead of `runserver` + auto-migrate on deploy |
| `backend/backend/settings.py` | Railway DB URL, WhiteNoise, env-based config |
| `backend/runtime.txt` | Python 3.11.6 pinned |
| `frontend/vite.config.js` | Production build config |

---

## 🚀 Step 1: Push to GitHub

```bash
# From project root (d:/laragon/www/python/Django-React-Full-Stack-App)
git init
git add .
git commit -m "Prepare for Railway deployment"

# Create repo on github.com first, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## 🚀 Step 2: Deploy Backend on Railway

### 2.1 Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 2.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Railway auto-detects Python + Procfile

### 2.3 Add PostgreSQL Database
1. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway auto-creates `DATABASE_URL` environment variable
3. This connects automatically to Django (already configured in `settings.py`)

### 2.4 Set Environment Variables
Go to your service → **Variables** tab, add:

| Variable | Value | Required |
|----------|-------|----------|
| `SECRET_KEY` | Generate: `python -c "import secrets; print(secrets.token_urlsafe(50))"` | ✅ |
| `DEBUG` | `False` | ✅ |
| `YOUTUBE_API_KEY` | Your YouTube API key | ✅ |
| `YOUTUBE_CLIENT_ID` | Your OAuth client ID | ⚠️ (if using OAuth) |
| `YOUTUBE_CLIENT_SECRET` | Your OAuth secret | ⚠️ (if using OAuth) |

---

## 🗄️ Step 3: Migrate Local Database to Railway

### Method A: `pg_dump` → `psql` (RECOMMENDED - Fastest)

```bash
# 1. Dump your local PostgreSQL database
pg_dump -h localhost -U postgres -d youtube_analytics --no-owner --no-acl > db_backup.sql

# 2. Install Railway CLI (if not already)
npm install -g @railway/cli

# 3. Login and link project
railway login
railway link        # select your project

# 4. Restore to Railway PostgreSQL
railway run psql < db_backup.sql

# 5. Verify tables
railway run "psql -c '\dt'"
```

### Method B: Django Fixtures (Slower but reliable)

```bash
# LOCAL MACHINE - Export data
python manage.py dumpdata --natural-primary --natural-foreign \
  --exclude auth.permission --exclude contenttypes \
  --indent 2 > db_fixture.json

# RAILWAY - Import after deployment
railway run python manage.py loaddata db_fixture.json
```

### Method C: CSV Export/Import (For specific tables)

```bash
# Export specific table from local
psql -U postgres -d youtube_analytics -c "\COPY users_userprofile TO '/tmp/users.csv' CSV HEADER;"

# Import to Railway
railway run "psql -c \"\\COPY users_userprofile FROM '/tmp/users.csv' CSV HEADER;\""
```

---

## 🔧 Step 4: Verify Deployment

```bash
# Check migrations ran automatically
railway logs

# Or manually run migrations if needed
railway run python manage.py migrate

# Create superuser on Railway
railway run python manage.py createsuperuser

# Check connected database
railway run python manage.py dbshell
# Then type: \dt
```

---

## 🌐 Step 5: Deploy Frontend (3 Options)

### Option 1: Serve React from Django (Simplest - Single Service)

Build React and serve via Django staticfiles:

```bash
# Build frontend
cd frontend
npm install
npm run build

# Copy dist to backend static
cp -r dist/* ../backend/staticfiles/

# Commit and push
cd ..
git add backend/staticfiles/
git commit -m "Add frontend build"
git push origin main
```

Railway will redeploy with frontend served at root URL.

### Option 2: Separate Railway Service for Frontend

Create a new Railway service:
1. **New** → **Empty Service**
2. Set **Root Directory** = `frontend`
3. Add start command: `npx serve -s dist -l $PORT`
4. Set env var: `VITE_API_URL=https://your-backend.up.railway.app`

### Option 3: Netlify/Vercel for Frontend (Recommended for production)

```bash
# Deploy frontend to Vercel
npm i -g vercel
cd frontend
vercel --prod
```

Update `frontend/src/api.js` base URL to point to Railway backend.

---

## 🔐 Environment Variables Reference

### For `.env` (Local Development)
```env
DEBUG=True
SECRET_KEY=django-insecure-local-only
DB_NAME=youtube_analytics
DB_USER=postgres
DB_PWD=postgres
DB_HOST=localhost
DB_PORT=5432
YOUTUBE_API_KEY=your-key-here
```

### For Railway (Production)
```env
DEBUG=False
SECRET_KEY=generated-secret-key
DATABASE_URL=auto-provided-by-railway
YOUTUBE_API_KEY=your-key-here
YOUTUBE_CLIENT_ID=your-client-id
YOUTUBE_CLIENT_SECRET=your-secret
```

---

## 🛠️ Troubleshooting

### "Database connection failed"
```bash
# Check DATABASE_URL is set
railway variables

# Test connection
railway run python -c "from django.db import connection; cursor = connection.cursor(); print('OK')"
```

### "Static files not loading"
```bash
# Run collectstatic manually
railway run python manage.py collectstatic --noinput

# Check WhiteNoise is in MIDDLEWARE (already done)
```

### "CORS errors"
```bash
# Add your frontend URL to CORS_ALLOWED_ORIGINS in settings.py
# Or set CORS_ALLOW_ALL_ORIGINS=True temporarily for testing
```

### "Migration errors"
```bash
# Reset migrations (WARNING: destroys data)
railway run python manage.py migrate --run-syncdb

# Or run specific migration
railway run python manage.py migrate api zero
railway run python manage.py migrate
```

---

## 📊 Architecture on Railway

```
┌─────────────────────────────────────────┐
│           Railway Project               │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │   Django     │  │  PostgreSQL  │    │
│  │   Backend    │  │   Database   │    │
│  │  (Gunicorn)  │  │              │    │
│  └──────┬───────┘  └──────────────┘    │
│         │                               │
│    your-app.up.railway.app              │
└─────────────────────────────────────────┘
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and responding
- [ ] PostgreSQL connected and tables exist
- [ ] Local data migrated successfully
- [ ] Static files serving correctly
- [ ] API endpoints working (`/api/auth/login/`)
- [ ] Admin panel accessible (`/admin/`)
- [ ] Frontend loading properly
- [ ] CORS configured for production domain
- [ ] Environment variables set correctly
- [ ] SSL/HTTPS working (Railway provides this)

---

**Need help?** Check Railway docs: [docs.railway.app](https://docs.railway.app)

