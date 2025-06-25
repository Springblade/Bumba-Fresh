# LAN Configuration Guide

## Overview
This guide explains what needs to be changed when connecting to a different LAN network to ensure the Bumba Fresh application works properly across different network environments.

## Current Network Configuration
The application is currently configured for IP address: `192.168.1.4`

## Files That Require IP Address Updates

### 1. Frontend Environment Configuration
**File:** `.env`
**Location:** Root directory
**Line 2:** 
```
VITE_API_URL=http://192.168.1.4:8000/api
```
**Change Required:** Replace `192.168.1.4` with your new LAN IP address

### 2. Backend Environment Configuration
**File:** `backend\.env`
**Location:** Backend directory
**Line 4:**
```
FRONTEND_URL=http://192.168.1.4:5173
```
**Change Required:** Replace `192.168.1.4` with your new LAN IP address

### 3. Backend CORS Configuration
**File:** `backend\src\index.js`
**Location:** Backend source directory
**Lines 51 & 55:**
```javascript
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'http://192.168.1.4:5173', // Network access (Line 51)
  'http://127.0.0.1:5173', // Localhost alternative
  'http://localhost:8080', // Alternative local port
  'http://192.168.1.4:8080', // Network access alternative port (Line 55)
];
```
**Change Required:** Replace both instances of `192.168.1.4` with your new LAN IP address

## Optional Documentation Updates

### 4. Batch Script Display Messages
These files contain hardcoded IPs in echo statements (informational only):

- **start-network.bat** (lines 33-35, 38)
- **start-servers.bat** (lines 23-25)
- **start-dev.bat** (lines 27-29)

### 5. Network Access Documentation
**File:** `NETWORK_ACCESS_GUIDE.md`
**Multiple references to:** `192.168.1.4`
**Lines:** 15-17, 40, 69, 72, 100, 124

## Files That DON'T Need Changes

These files are already properly configured for network flexibility:

- ✅ **vite.config.ts** - Uses `host: '0.0.0.0'` (accepts all network interfaces)
- ✅ **src/services/api.ts** - Uses environment variables (`VITE_API_URL`)
- ✅ **src/components/debug/ApiStatus.tsx** - Uses environment variables
- ✅ **src/components/OurMeals.tsx** - Uses environment variables

## Quick Setup Process for New LAN

### ⚡ Automated Setup (Recommended)

**Use the provided automation scripts for instant configuration:**

1. **Run the batch script (easiest):**
   ```cmd
   update-network-config.bat
   ```
   - Interactive menu with auto-detection
   - No PowerShell knowledge required
   - Handles execution policy issues

2. **Run the PowerShell script directly:**
   ```powershell
   # Auto-detect and update
   .\update-network-config.ps1
   
   # Use specific IP
   .\update-network-config.ps1 -TargetIP 192.168.1.100
   
   # Show current configuration
   .\update-network-config.ps1 -ShowCurrentConfig
   ```

### 🔧 Manual Setup (if automated scripts fail)

#### Minimum Required Changes (3 files):

1. **Update `.env`**
   ```bash
   VITE_API_URL=http://[NEW_IP]:8000/api
   ```

2. **Update `backend\.env`**
   ```bash
   FRONTEND_URL=http://[NEW_IP]:5173
   ```

3. **Update `backend\src\index.js`**
   ```javascript
   const allowedOrigins = [
     'http://localhost:5173',
     'http://[NEW_IP]:5173', // Update this line
     'http://127.0.0.1:5173',
     'http://localhost:8080',
     'http://[NEW_IP]:8080', // Update this line
   ];
   ```

### Steps to Find Your New IP Address:

1. **Windows Command Prompt:**
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" under your active network adapter

2. **PowerShell:**
   ```powershell
   Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*"}
   ```

## Network Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   Port: 5173    │◄──►│   Port: 8000    │◄──►│   Port: 3306    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                    ┌─────────────────┐
                    │   Your Device   │
                    │  IP: [NEW_IP]   │
                    └─────────────────┘
```

## Troubleshooting

### Common Issues:
1. **CORS Errors:** Make sure `backend\src\index.js` has the correct IP in `allowedOrigins`
2. **API Connection Failed:** Verify `.env` has the correct `VITE_API_URL`
3. **Can't Access from Other Devices:** Ensure Windows Firewall allows connections on ports 5173 and 8000

### Port Requirements:
- **5173:** Vite development server (frontend)
- **8000:** Express.js backend server
- **3306:** MySQL database (local only)

## Security Considerations

- Only change IP addresses for trusted local networks
- Ensure firewall rules are appropriate for your network environment
- Consider using environment-specific configuration files for different networks

## Future Improvements

Consider implementing:
- ✅ **Automatic IP detection scripts** (COMPLETED - see `update-network-config.ps1` and `update-network-config.bat`)
- Environment-specific configuration files
- Docker containerization for easier network portability
- Configuration management tools

## Automation Scripts

### Available Scripts:

1. **`update-network-config.ps1`** - PowerShell script with full functionality
   - Auto-detects network IP addresses
   - Updates all configuration files
   - Provides detailed feedback and error handling
   - Supports manual IP specification

2. **`update-network-config.bat`** - Simple batch wrapper
   - User-friendly menu interface
   - Handles PowerShell execution policy issues
   - No technical knowledge required

### Script Features:
- ✅ Automatic IP detection from network adapters
- ✅ Updates all core configuration files (.env, backend\.env, index.js)
- ✅ Optional updates for batch scripts and documentation
- ✅ Configuration validation and conflict detection
- ✅ Colored output for better readability
- ✅ Backup and safety checks
- ✅ Interactive confirmation prompts

---

**Last Updated:** January 26, 2025
**Project:** Bumba Fresh
**Network Configuration Version:** 1.0
