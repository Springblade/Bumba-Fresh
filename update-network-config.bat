@echo off
setlocal enabledelayedexpansion

:: Bumba Fresh Network Configuration Updater (Batch Version)
:: Simple batch script to update IP configuration

echo.
echo Bumba Fresh Network Configuration Updater
echo =========================================
echo.

:: Check if PowerShell script exists
if not exist "update-network-config.ps1" (
    echo Error: update-network-config.ps1 not found!
    echo Please ensure the PowerShell script is in the same directory.
    pause
    exit /b 1
)

:: Check execution policy and run PowerShell script
echo Checking PowerShell execution policy...
powershell -Command "Get-ExecutionPolicy" > temp_policy.txt
set /p current_policy=<temp_policy.txt
del temp_policy.txt

if "%current_policy%"=="Restricted" (
    echo.
    echo Warning: PowerShell execution policy is Restricted.
    echo This may prevent the script from running.
    echo.
    echo To fix this, run PowerShell as Administrator and execute:
    echo Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    echo.
    pause
)

:: Menu options
echo Select an option:
echo 1. Auto-detect and update IP configuration
echo 2. Specify custom IP address
echo 3. Show current configuration
echo 4. Help
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Running auto-detection...
    powershell -ExecutionPolicy Bypass -File "update-network-config.ps1"
) else if "%choice%"=="2" (
    echo.
    set /p custom_ip="Enter IP address (e.g., 192.168.1.100): "
    echo.
    echo Using custom IP: !custom_ip!
    powershell -ExecutionPolicy Bypass -File "update-network-config.ps1" -TargetIP "!custom_ip!"
) else if "%choice%"=="3" (
    echo.
    powershell -ExecutionPolicy Bypass -File "update-network-config.ps1" -ShowCurrentConfig
) else if "%choice%"=="4" (
    echo.
    powershell -ExecutionPolicy Bypass -File "update-network-config.ps1" -Help
) else if "%choice%"=="5" (
    exit /b 0
) else (
    echo Invalid choice. Please select 1-5.
    pause
    goto :eof
)

echo.
pause
