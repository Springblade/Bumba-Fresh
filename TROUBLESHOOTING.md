# 🔧 Troubleshooting: "Failed to load meals" Error

## Problem
When clicking on the Menu page, you see: "Failed to load meals. Please try again later."

## Root Cause
The frontend cannot connect to the backend API server. This happens when:
1. Backend server is not running
2. Backend is running on wrong port
3. Database connection issues
4. CORS configuration problems

## ✅ Step-by-Step Solution

### Step 1: Check Backend Server Status
```bash
# Navigate to backend directory
cd a:\Bumba-Fresh\backend

# Start the backend server
npm start
```

**Expected output:**
```
🚀 Bumba Fresh API server running on port 8000
📊 Environment: development
🌐 CORS enabled for: http://localhost:5173
```

### Step 2: Verify Database Connection
```bash
# Test database connectivity
cd a:\Bumba-Fresh
node test-db-connection.js
```

**Expected output:**
```
✅ Database connection successful!
✅ Account table exists
✅ Inventory table exists with X meals
```

### Step 3: Test API Endpoints Directly
Open your browser and go to:
- **Health Check**: http://localhost:8000/health
- **Meals API**: http://localhost:8000/api/meals

**Expected responses:**
```json
// Health check
{
  "status": "OK",
  "timestamp": "2025-01-XX...",
  "uptime": 123.45,
  "environment": "development"
}

// Meals API  
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Meal Name",
      "description": "...",
      "price": 12.99,
      // ... more meal data
    }
  ]
}
```

### Step 4: Check Frontend Connection
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to Menu page
4. Look for error messages

**Common error patterns:**
- `Failed to fetch` → Backend not running
- `CORS error` → CORS configuration issue
- `404 Not Found` → Wrong API endpoint
- `500 Internal Server Error` → Backend/database issue

### Step 5: Use Quick Start Scripts
```bash
# Option 1: PowerShell (recommended)
.\start-servers.ps1

# Option 2: Batch file
.\start-servers.bat

# Option 3: VS Code Tasks
# Press Ctrl+Shift+P → "Tasks: Run Task" → "Start Full Stack"
```

## 🚨 Common Issues & Fixes

### Issue 1: "ECONNREFUSED" Error
**Problem**: Backend server not running
**Solution**: 
```bash
cd backend && npm start
```

### Issue 2: Database Connection Failed
**Problem**: PostgreSQL not running or wrong credentials
**Solution**:
1. Start PostgreSQL service
2. Check `backend/.env` file for correct database settings
3. Run: `node test-db-connection.js`

### Issue 3: Port Already in Use
**Problem**: Port 8000 or 5173 already occupied
**Solution**:
```bash
# Check what's using the ports
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Kill process if needed (replace PID)
taskkill /PID <PID> /F
```

### Issue 4: CORS Errors
**Problem**: Frontend/backend on different origins
**Solution**: Backend should allow `http://localhost:5173` (already configured)

### Issue 5: Environment Variables
**Problem**: Missing or incorrect environment variables
**Solution**: Create `backend/.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mealkits
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🔍 Debug Mode

The frontend now includes API status checking. When you see the error:
1. Check the "API Connection Status" section
2. Click "Check Again" button
3. Follow the troubleshooting steps provided

## 📞 Still Need Help?

If the issue persists:
1. Check all console logs in browser DevTools
2. Check backend server logs in terminal
3. Verify PostgreSQL is running with correct database
4. Ensure all npm dependencies are installed:
   ```bash
   # Frontend
   npm install
   
   # Backend  
   cd backend && npm install
   ```

## 🎯 Quick Verification Checklist

- [ ] PostgreSQL service running
- [ ] Backend server running on port 8000
- [ ] Frontend dev server running on port 5173
- [ ] Database has meal data
- [ ] No CORS errors in browser console
- [ ] Backend health check responds: http://localhost:8000/health
- [ ] Meals API responds: http://localhost:8000/api/meals
