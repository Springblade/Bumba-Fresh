@echo off
echo  Starting Bumba-Fresh Full Stack Application
echo.

echo  Prerequisites Check:
echo - Node.js should be installed
echo - PostgreSQL should be running
echo - Database should be set up
echo.

echo  Starting Backend Server...
start cmd /k "cd /d %~dp0backend && npm start"
timeout /t 3 /nobreak > nul

echo  Starting Frontend Development Server...
start cmd /k "cd /d %~dp0 && npm run dev -- --host"
timeout /t 2 /nobreak > nul

echo.
echo  Both servers should be starting now!
echo.
echo  URLs:
echo - Frontend: http://localhost:5173 (local) or http://192.168.1.4:5173 (network)
echo - Backend API: http://localhost:8000 (local) or http://192.168.1.4:8000 (network)
echo - Backend Health: http://localhost:8000/health or http://192.168.1.4:8000/health
echo.
echo  If you see connection errors:
echo 1. Check that PostgreSQL is running
echo 2. Verify database configuration in backend/.env
echo 3. Ensure ports 5173 and 8000 are available
echo.
pause
