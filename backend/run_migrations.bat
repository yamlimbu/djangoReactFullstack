@echo off
echo Running Django Migrations...
echo.

echo Step 1: Creating migrations for api app...
python manage.py makemigrations api

echo.
echo Step 2: Applying migrations...
python manage.py migrate

echo.
echo Step 3: Creating superuser (optional)...
echo If you want to create a superuser, run: python manage.py createsuperuser
echo.
echo Migrations completed!
pause
