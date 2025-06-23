@echo off
REM Windows batch script to run just the database migration

echo.
echo =======================================
echo   FAVORITES DATABASE MIGRATION
echo =======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Navigate to database directory and run migration
cd database

echo Running database migration...
node run-favorite-migration.js

if %errorlevel% equ 0 (
    echo.
    echo =======================================
    echo   MIGRATION COMPLETED SUCCESSFULLY!
    echo =======================================
    echo.
    echo The favorites table has been created with:
    echo - Primary key (favorite_id)
    echo - Foreign keys to users and meals
    echo - Unique constraint to prevent duplicates
    echo - Indexes for optimal performance
    echo.
) else (
    echo.
    echo =======================================
    echo   MIGRATION FAILED - CHECK LOGS ABOVE
    echo =======================================
    echo.
    echo Common issues:
    echo - Database server not running
    echo - Incorrect database credentials
    echo - Missing required tables (account, inventory)
    echo.
)

cd ..
pause
