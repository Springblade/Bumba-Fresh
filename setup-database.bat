@echo off
echo 🗄️ Setting up Bumba Fresh Database...
echo.

REM Try common PostgreSQL installation paths
set PGPATH=""
if exist "E:\PostgreSQL\bin\psql.exe" set PGPATH="E:\PostgreSQL\bin\psql.exe"
if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" set PGPATH="C:\Program Files\PostgreSQL\14\bin"
if exist "C:\Program Files\PostgreSQL\13\bin\psql.exe" set PGPATH="C:\Program Files\PostgreSQL\13\bin"
if exist "C:\Program Files\PostgreSQL\12\bin\psql.exe" set PGPATH="C:\Program Files\PostgreSQL\12\bin"

if %PGPATH%=="" (
    echo  PostgreSQL not found in common installation paths
    echo.
    echo  Please install PostgreSQL from https://www.postgresql.org/download/windows/
    echo  Or add PostgreSQL bin directory to your PATH environment variable
    echo.
    pause
    exit /b 1
)

echo  Found PostgreSQL at %PGPATH%
echo.

REM Add PostgreSQL to PATH for this session
set PATH=%PGPATH:"=%;%PATH%

echo 🔍 Testing PostgreSQL connection...
psql -U postgres -c "SELECT version();" 2>nul
if errorlevel 1 (
    echo  Cannot connect to PostgreSQL
    echo  Make sure PostgreSQL service is running
    echo  Check your password in backend/.env file
    echo.
    pause
    exit /b 1
)

echo  PostgreSQL is running
echo.

echo  Creating/Updating database...
psql -U postgres -c "DROP DATABASE IF EXISTS Bumba_fresh;"
psql -U postgres -c "CREATE DATABASE Bumba_fresh;"

echo  Running database schema...
psql -U postgres -d Bumba_fresh -f database/init.sql

if errorlevel 1 (
    echo  Database setup failed
    pause
    exit /b 1
)

echo  Database setup completed successfully!
echo.
echo  Database: Bumba_fresh
echo  Default admin account: admin@gmail.com / password123
echo.
pause
