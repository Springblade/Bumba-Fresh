# Bumba Fresh Network Configuration Updater
# PowerShell script to update IP configuration for development environment

param(
    [string]$TargetIP,
    [switch]$ShowCurrentConfig,
    [switch]$Help
)

# Function to show help
function Show-Help {
    Write-Host ""
    Write-Host "Bumba Fresh Network Configuration Updater" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "This script helps update network configuration files for the Bumba Fresh application."
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\update-network-config.ps1                    # Auto-detect IP"
    Write-Host "  .\update-network-config.ps1 -TargetIP <IP>     # Use custom IP"
    Write-Host "  .\update-network-config.ps1 -ShowCurrentConfig # Show current config"
    Write-Host "  .\update-network-config.ps1 -Help              # Show this help"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\update-network-config.ps1 -TargetIP 192.168.1.100"
    Write-Host "  .\update-network-config.ps1 -ShowCurrentConfig"
    Write-Host ""
}

# Function to get local IP address
function Get-LocalIPAddress {
    try {
        $ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
            $_.InterfaceAlias -notlike "*Loopback*" -and
            $_.InterfaceAlias -notlike "*Bluetooth*" -and
            $_.IPAddress -ne "127.0.0.1" -and
            $_.PrefixOrigin -eq "Dhcp" -or $_.PrefixOrigin -eq "Manual"
        } | Sort-Object InterfaceAlias
        
        if ($ipAddresses.Count -gt 0) {
            return $ipAddresses[0].IPAddress
        }
        
        # Fallback method
        $networkAdapters = Get-WmiObject -Class Win32_NetworkAdapterConfiguration | Where-Object {
            $_.IPEnabled -eq $true -and $_.IPAddress -ne $null
        }
        
        foreach ($adapter in $networkAdapters) {
            foreach ($ip in $adapter.IPAddress) {
                if ($ip -match "^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[01])\.") {
                    return $ip
                }
            }
        }
        
        return $null
    }
    catch {
        Write-Warning "Error detecting IP address: $($_.Exception.Message)"
        return $null
    }
}

# Function to show current configuration
function Show-CurrentConfig {
    Write-Host ""
    Write-Host "Current Network Configuration:" -ForegroundColor Green
    Write-Host "=============================" -ForegroundColor Green
    Write-Host ""
    
    # Show detected IP
    $currentIP = Get-LocalIPAddress
    if ($currentIP) {
        Write-Host "Detected IP Address: $currentIP" -ForegroundColor Yellow
    } else {
        Write-Host "Could not detect IP address" -ForegroundColor Red
    }
    
    # Show network adapters
    Write-Host ""
    Write-Host "Network Adapters:" -ForegroundColor Cyan
    Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
        $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -ne "127.0.0.1"
    } | ForEach-Object {
        Write-Host "  $($_.InterfaceAlias): $($_.IPAddress)" -ForegroundColor White
    }
    
    # Check configuration files
    Write-Host ""
    Write-Host "Configuration Files:" -ForegroundColor Cyan
    
    $configFiles = @(
        "vite.config.ts",
        "backend/src/config/database.js",
        "backend/src/config/server.js",
        "package.json"
    )
    
    foreach ($file in $configFiles) {
        if (Test-Path $file) {
            Write-Host "  ✓ $file exists" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $file not found" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

# Function to update configuration files
function Update-ConfigFiles {
    param([string]$NewIP)
    
    $updatedFiles = @()
    
    Write-Host "Updating configuration files with IP: $NewIP" -ForegroundColor Green
    Write-Host ""
    
    # Update vite.config.ts
    if (Test-Path "vite.config.ts") {
        try {
            $viteConfig = Get-Content "vite.config.ts" -Raw
            $originalConfig = $viteConfig
            
            # Update host in server configuration
            $viteConfig = $viteConfig -replace "host:\s*['\`"][^'\`"]*['\`"]", "host: '$NewIP'"
            $viteConfig = $viteConfig -replace "host:\s*true", "host: '$NewIP'"
            
            if ($viteConfig -ne $originalConfig) {
                Set-Content "vite.config.ts" $viteConfig
                $updatedFiles += "vite.config.ts"
                Write-Host "  ✓ Updated vite.config.ts" -ForegroundColor Green
            } else {
                Write-Host "  - vite.config.ts (no changes needed)" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "  ✗ Error updating vite.config.ts: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # Update backend configuration if it exists
    $backendConfigPath = "backend/src/config"
    if (Test-Path $backendConfigPath) {
        # Update database.js if it exists
        $dbConfigPath = "$backendConfigPath/database.js"
        if (Test-Path $dbConfigPath) {
            try {
                $dbConfig = Get-Content $dbConfigPath -Raw
                $originalConfig = $dbConfig
                
                # Update host configuration
                $dbConfig = $dbConfig -replace "host:\s*['\`"][^'\`"]*['\`"]", "host: '$NewIP'"
                
                if ($dbConfig -ne $originalConfig) {
                    Set-Content $dbConfigPath $dbConfig
                    $updatedFiles += $dbConfigPath
                    Write-Host "  ✓ Updated $dbConfigPath" -ForegroundColor Green
                } else {
                    Write-Host "  - $dbConfigPath (no changes needed)" -ForegroundColor Yellow
                }
            }
            catch {
                Write-Host "  ✗ Error updating $dbConfigPath: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        # Update server.js if it exists
        $serverConfigPath = "$backendConfigPath/server.js"
        if (Test-Path $serverConfigPath) {
            try {
                $serverConfig = Get-Content $serverConfigPath -Raw
                $originalConfig = $serverConfig
                
                # Update host configuration
                $serverConfig = $serverConfig -replace "host:\s*['\`"][^'\`"]*['\`"]", "host: '$NewIP'"
                
                if ($serverConfig -ne $originalConfig) {
                    Set-Content $serverConfigPath $serverConfig
                    $updatedFiles += $serverConfigPath
                    Write-Host "  ✓ Updated $serverConfigPath" -ForegroundColor Green
                } else {
                    Write-Host "  - $serverConfigPath (no changes needed)" -ForegroundColor Yellow
                }
            }
            catch {
                Write-Host "  ✗ Error updating $serverConfigPath: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    
    # Update any environment files
    $envFiles = @(".env", ".env.local", ".env.development")
    foreach ($envFile in $envFiles) {
        if (Test-Path $envFile) {
            try {
                $envContent = Get-Content $envFile
                $originalContent = $envContent
                
                # Update various IP-related environment variables
                $envContent = $envContent -replace "VITE_API_URL=.*", "VITE_API_URL=http://$NewIP:3001"
                $envContent = $envContent -replace "API_URL=.*", "API_URL=http://$NewIP:3001"
                $envContent = $envContent -replace "HOST=.*", "HOST=$NewIP"
                $envContent = $envContent -replace "SERVER_HOST=.*", "SERVER_HOST=$NewIP"
                
                if (($envContent | Out-String) -ne ($originalContent | Out-String)) {
                    Set-Content $envFile $envContent
                    $updatedFiles += $envFile
                    Write-Host "  ✓ Updated $envFile" -ForegroundColor Green
                } else {
                    Write-Host "  - $envFile (no changes needed)" -ForegroundColor Yellow
                }
            }
            catch {
                Write-Host "  ✗ Error updating $envFile: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    
    Write-Host ""
    if ($updatedFiles.Count -gt 0) {
        Write-Host "Successfully updated $($updatedFiles.Count) file(s):" -ForegroundColor Green
        foreach ($file in $updatedFiles) {
            Write-Host "  - $file" -ForegroundColor White
        }
        Write-Host ""
        Write-Host "Note: You may need to restart your development servers for changes to take effect." -ForegroundColor Yellow
    } else {
        Write-Host "No files needed updating." -ForegroundColor Yellow
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

Write-Host ""
Write-Host "Bumba Fresh Network Configuration Updater" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Determine target IP
if ($TargetIP) {
    # Validate IP format
    if ($TargetIP -match "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$") {
        Write-Host "Using provided IP address: $TargetIP" -ForegroundColor Yellow
        $ipToUse = $TargetIP
    } else {
        Write-Host "Error: Invalid IP address format: $TargetIP" -ForegroundColor Red
        Write-Host "Please provide a valid IP address (e.g., 192.168.1.100)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Auto-detecting IP address..." -ForegroundColor Yellow
    $ipToUse = Get-LocalIPAddress
    
    if (-not $ipToUse) {
        Write-Host "Error: Could not auto-detect IP address." -ForegroundColor Red
        Write-Host "Please run the script with -TargetIP parameter:" -ForegroundColor Red
        Write-Host "  .\update-network-config.ps1 -TargetIP 192.168.1.100" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "Detected IP address: $ipToUse" -ForegroundColor Green
}

Write-Host ""

# Confirm with user (only in interactive mode)
if ($Host.Name -eq "ConsoleHost") {
    $confirmation = Read-Host "Update configuration files with IP $ipToUse? (y/N)"
    if ($confirmation -notmatch "^[Yy]") {
        Write-Host "Operation cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Update configuration files
Update-ConfigFiles -NewIP $ipToUse

Write-Host ""
Write-Host "Network configuration update completed!" -ForegroundColor Green
Write-Host ""
