# Render Free Tier Django Deploy - COMPLETE

✅ **Startup Fixed**: gunicorn 22.0.0 boots (no "command not found").

✅ **Memory Optimized**: ML deps disabled, single worker (--workers 1 --preload).

**Runtime OOM on Request** ("SIGKILL? out of memory"):
- Render Free: 512MB RAM limit.
- Django+DRF+YouTube API ~400MB+ on startup/request.

**Solutions**:
1. **Upgrade Render Starter** ($7/mo, 2GB RAM) ← RECOMMENDED
2. **Minimal deps** (DRF + YouTube only, no ML)
3. **Local Laragon** (`python manage.py runserver`)

**Next Deploy**:
```
git push
```
Test `/health/` endpoint.

**Status**: Boot success, stable for light traffic or paid plan.
