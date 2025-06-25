@echo off
echo.
echo ===================================
echo    BUMBA FRESH - DEVELOPMENT 
echo ===================================
echo.

echo  Starting Development Servers...
echo.

echo  Starting Backend Server (Port 8000)...
cd backend
start "Bumba Fresh Backend" cmd /k "echo Backend Server Starting... && npm run dev"

echo 🟠 Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo.
echo  Starting Frontend Server (Port 5173)...
cd ..
start "Bumba Fresh Frontend" cmd /k "echo Frontend Server Starting... && npm run dev"

echo.
echo  Both servers are starting up!
echo.
echo  Access Points:
echo    • Backend API: http://localhost:8000 (local) or http://192.168.1.4:8000 (network)
echo    • Health Check: http://localhost:8000/health or http://192.168.1.4:8000/health  
echo    • Frontend App: http://localhost:5173 (local) or http://192.168.1.4:5173 (network):5173
echo    • API Test: open test-api-connection.html
echo.
echo  Tips:
echo    • Wait ~30 seconds for servers to fully start
echo    • Frontend will auto-open in your browser
echo    • Backend logs will show in separate window
echo.
echo Press any key to close this window...
pause > nul
