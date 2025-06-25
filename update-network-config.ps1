param(
    [string]$TargetIP,
    [switch]$ShowCurrentConfig,
    [switch]$Help
)

# Bumba Fresh Network Configuration Updater
# PowerShell script to automatically update IP configuration across all files

function Show-Help {
    Write-Host "Bumba Fresh Network Configuration Updater" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\update-network-config.ps1                    # Auto-detect IP and update"
    Write-Host "  .\update-network-config.ps1 -TargetIP <IP>     # Use specific IP"
    Write-Host "  .\update-network-config.ps1 -ShowCurrentConfig # Show current configuration"
    Write-Host "  .\update-network-config.ps1 -Help              # Show this help"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\update-network-config.ps1 -TargetIP 192.168.1.100"
    Write-Host "  .\update-network-config.ps1 -ShowCurrentConfig"
}

function Get-LocalIPAddress {
    try {
        # Get active network adapters with IPv4 addresses
        $adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }
        
        foreach ($adapter in $adapters) {
            $ipConfig = Get-NetIPAddress -InterfaceIndex $adapter.InterfaceIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue
            if ($ipConfig -and $ipConfig.IPAddress -ne "127.0.0.1") {
                # Filter out APIPA addresses (169.254.x.x)
                if (-not $ipConfig.IPAddress.StartsWith("169.254")) {
                    return $ipConfig.IPAddress
                }
            }
        }
        
        Write-Warning "Could not detect a valid IP address. Using localhost as fallback."
        return "localhost"
    }
    catch {
        Write-Warning "Error detecting IP address: $($_.Exception.Message)"
        return "localhost"
    }
}

function Show-CurrentConfig {
    Write-Host "Current Network Configuration:" -ForegroundColor Green
    Write-Host "=============================" -ForegroundColor Green
    
    # Check .env file
    if (Test-Path ".env") {
        $envContent = Get-Content ".env"
        $apiUrl = $envContent | Where-Object { $_ -match "VITE_API_URL=" }
        Write-Host "Frontend (.env): $apiUrl" -ForegroundColor Cyan
    }
    
    # Check backend/.env file
    if (Test-Path "backend\.env") {
        $backendEnvContent = Get-Content "backend\.env"
        $frontendUrl = $backendEnvContent | Where-Object { $_ -match "FRONTEND_URL=" }
        Write-Host "Backend (backend\.env): $frontendUrl" -ForegroundColor Cyan
    }
    
    # Check backend/src/index.js for CORS configuration
    if (Test-Path "backend\src\index.js") {
        $indexContent = Get-Content "backend\src\index.js" -Raw
        if ($indexContent -match "192\.168\.\d+\.\d+") {
            Write-Host "Backend CORS: Contains hardcoded IP addresses" -ForegroundColor Yellow
        } else {
            Write-Host "Backend CORS: No hardcoded IP addresses found" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "Detected Local IP: $(Get-LocalIPAddress)" -ForegroundColor Magenta
}

function Update-ConfigurationFiles {
    param([string]$NewIP)
    
    $filesUpdated = 0
    $errors = @()
    
    Write-Host "Updating configuration files with IP: $NewIP" -ForegroundColor Green
    Write-Host ""
    
    # Update .env file
    try {
        if (Test-Path ".env") {
            $content = Get-Content ".env"
            $updated = $false
            
            for ($i = 0; $i -lt $content.Length; $i++) {
                if ($content[$i] -match "VITE_API_URL=http://(\d+\.\d+\.\d+\.\d+):8000/api") {
                    $oldIP = $matches[1]
                    $content[$i] = "VITE_API_URL=http://${NewIP}:8000/api"
                    Write-Host " Updated .env: $oldIP → $NewIP" -ForegroundColor Green
                    $updated = $true
                }
            }
            
            if ($updated) {
                $content | Set-Content ".env"
                $filesUpdated++
            }
        }
    }
    catch {
        $errors += "Error updating .env: $($_.Exception.Message)"
    }
    
    # Update backend/.env file
    try {
        if (Test-Path "backend\.env") {
            $content = Get-Content "backend\.env"
            $updated = $false
            
            for ($i = 0; $i -lt $content.Length; $i++) {
                if ($content[$i] -match "FRONTEND_URL=http://(\d+\.\d+\.\d+\.\d+):5173") {
                    $oldIP = $matches[1]
                    $content[$i] = "FRONTEND_URL=http://${NewIP}:5173"
                    Write-Host " Updated backend\.env: $oldIP → $NewIP" -ForegroundColor Green
                    $updated = $true
                }
            }
            
            if ($updated) {
                $content | Set-Content "backend\.env"
                $filesUpdated++
            }
        }
    }
    catch {
        $errors += "Error updating backend\.env: $($_.Exception.Message)"
    }
    
    # Update backend/src/index.js CORS configuration
    try {
        if (Test-Path "backend\src\index.js") {
            $content = Get-Content "backend\src\index.js" -Raw
            $originalContent = $content
            
            # Update CORS origins
            $content = $content -replace "http://\d+\.\d+\.\d+\.\d+:5173", "http://${NewIP}:5173"
            $content = $content -replace "http://\d+\.\d+\.\d+\.\d+:8080", "http://${NewIP}:8080"
            
            if ($content -ne $originalContent) {
                $content | Set-Content "backend\src\index.js"
                Write-Host " Updated backend\src\index.js CORS configuration" -ForegroundColor Green
                $filesUpdated++
            }
        }
    }
    catch {
        $errors += "Error updating backend\src\index.js: $($_.Exception.Message)"
    }
    
    Write-Host ""
    Write-Host "Summary:" -ForegroundColor Yellow
    Write-Host "Files updated: $filesUpdated" -ForegroundColor Green
    
    if ($errors.Count -gt 0) {
        Write-Host "Errors encountered:" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host "  - $error" -ForegroundColor Red
        }
    }
    
    if ($filesUpdated -gt 0) {
        Write-Host ""
        Write-Host " Configuration updated successfully!" -ForegroundColor Green
        Write-Host "You can now start your servers with the new IP configuration." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Start the backend server: cd backend && npm start"
        Write-Host "2. Start the frontend server: npm run dev"
        Write-Host "3. Access the application at: http://${NewIP}:5173"
    }
}

# Main script logic
if ($Help) {
    Show-Help
    exit 0
}

if ($ShowCurrentConfig) {
    Show-CurrentConfig
    exit 0
}

if (-not $TargetIP) {
    Write-Host "Auto-detecting local IP address..." -ForegroundColor Cyan
    $TargetIP = Get-LocalIPAddress
    Write-Host "Detected IP: $TargetIP" -ForegroundColor Green
    Write-Host ""
}

# Validate IP address format
if ($TargetIP -ne "localhost" -and $TargetIP -notmatch "^\d+\.\d+\.\d+\.\d+$") {
    Write-Host "Error: Invalid IP address format: $TargetIP" -ForegroundColor Red
    Write-Host "Please provide a valid IPv4 address (e.g., 192.168.1.100)" -ForegroundColor Yellow
    exit 1
}

Update-ConfigurationFiles -NewIP $TargetIP
