# Database Credentials - File Reference

This document lists all files in the Bumba Fresh project that contain database connection details, credentials, or configuration.

## 🔐 **Environment & Configuration Files**

### Primary Configuration Files
- **`backend/.env`** - Main environment configuration file
  - Contains: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
  - Values: `localhost:5432`, `Bumba_fresh`, `postgres`, `999999`

### Database Connection Module
- **`database/src/connect.js`** - Main database connection utility
  - Uses environment variables with fallback to hardcoded values
  - Contains: Pool configuration with all DB credentials

## 📁 **Database Management Scripts**

### Setup & Migration Scripts
- **`apply-role-migration-step.cjs`** - RBAC migration script
- **`setup-database.cjs`** - Database setup automation
- **`reset-admin.cjs`** - Admin password reset utility
- **`create-dietitian-account.cjs`** - Dietitian account creation

### Database Utility Scripts
- **`database/examine-db.cjs`** - Database examination tool
- **`database/truncate-all.cjs`** - Table truncation utility
- **`database/verify-empty.cjs`** - Empty database verification
- **`examine-db.js`** - Alternative database examination

### Testing & Verification Scripts
- **`test-rbac.cjs`** - Role-based access control testing
- **`test-db-check.cjs`** - Database content verification
- **`check-admin.cjs`** - Admin account verification
- **`check-role-column.cjs`** - Role column verification
- **`diagnose.cjs`** - General diagnostic tool

## 🔍 **Standard Database Connection Pattern**

Most files use this connection pattern:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'Bumba_fresh',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '999999'
});
```

## 📊 **Database Credentials Summary**

| **Parameter** | **Environment Variable** | **Default Value** |
|---------------|-------------------------|-------------------|
| Host          | `DB_HOST`               | `localhost`       |
| Port          | `DB_PORT`               | `5432`            |
| Database      | `DB_NAME`               | `Bumba_fresh`     |
| Username      | `DB_USER`               | `postgres`        |
| Password      | `DB_PASSWORD`           | `999999`          |

## 🚨 **Security Notes**

### Files with Hardcoded Credentials (High Priority)
1. **`reset-admin.cjs`** - Contains hardcoded credentials
2. **`test-rbac.cjs`** - Contains hardcoded credentials  
3. **`test-db-check.cjs`** - Contains hardcoded credentials
4. **`apply-role-migration-step.cjs`** - Contains hardcoded credentials
5. **`create-dietitian-account.cjs`** - Contains hardcoded credentials
6. **`check-admin.cjs`** - Contains hardcoded credentials
7. **`diagnose.cjs`** - Contains hardcoded credentials
8. **`check-role-column.cjs`** - Contains hardcoded credentials

### Files with Environment Variable Support (Best Practice)
1. **`backend/.env`** - Environment configuration (should be in .gitignore)
2. **`database/src/connect.js`** - Uses environment variables with fallbacks
3. **`database/examine-db.cjs`** - Uses environment variables with fallbacks
4. **`database/truncate-all.cjs`** - Uses environment variables with fallbacks
5. **`database/verify-empty.cjs`** - Uses environment variables with fallbacks
6. **`examine-db.js`** - Uses environment variables with fallbacks

## 🔧 **Recommendations**

### For Production Deployment:
1. **Remove hardcoded credentials** from all script files
2. **Use environment variables** for all database connections
3. **Add `.env` to `.gitignore`** if not already present
4. **Create separate production environment** files
5. **Implement proper secret management** for production

### For Development:
1. **Current setup is functional** for local development
2. **Password `999999`** is the standard across all files
3. **Database `Bumba_fresh`** is consistently used
4. **All scripts connect to `localhost:5432`**

---

**Last Updated:** June 21, 2025  
**Total Files with DB Credentials:** 18 files  
**Security Level:** Development (Hardcoded credentials present)
