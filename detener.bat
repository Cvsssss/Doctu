@echo off
echo    Apagando DOCTU


echo.
echo [1/2] Apagando Frontend y Backend
docker-compose down

echo.
echo [2/2] Apagando Base de Datos (Supabase)
cd Back
call supabase stop
cd ..

echo.
echo Todo se ha detenido correctamente.
pause