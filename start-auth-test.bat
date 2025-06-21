@echo off
echo.
echo ===================================
echo    BUMBA FRESH - AUTH TEST SETUP
echo ===================================
echo.

echo 🔧 Setting up authentication testing environment...
echo.

REM Step 1: Setup database
echo 📊 Step 1: Setting up database...
call setup-database.bat
if errorlevel 1 (
    echo ❌ Database setup failed!
    pause
    exit /b 1
)

echo.
echo 🚀 Step 2: Starting backend server...
cd backend
start "Bumba Fresh Backend" cmd /k "echo Backend Server Starting for Auth Testing... && npm run dev"

echo.
echo 🌐 Step 3: Opening auth test page...
timeout /t 3 /nobreak > nul
start auth-test-page.html

echo.
echo ✅ Auth test environment ready!
echo.
echo 📍 What's running:
echo    • Backend API: http://localhost:8000
echo    • Auth test page opened in browser
echo.
echo 💡 How to use the test page:
echo    1. Wait for backend to fully start (about 30 seconds)
echo    2. Click "Run All Tests" to test everything automatically
echo    3. Or use individual test sections for specific testing
echo.
echo 🔍 Troubleshooting:
echo    • If backend fails: Check PostgreSQL is running
echo    • If tests fail: Check browser console for errors
echo    • If database errors: Re-run setup-database.bat
echo.
pause
