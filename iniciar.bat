@echo off
echo   Iniciando  DOCTU


echo.
echo [1/2] Levantando Base de Datos e Infraestructura (Supabase)
cd Back
call supabase start
cd ..

echo.
echo [2/2] Levantando Frontend (React) y Backend (Node.js)
docker-compose up --build

echo.
pause