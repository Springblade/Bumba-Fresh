# Favorites Functionality Implementation

This document describes the complete implementation of the favorites functionality for the Bumba Fresh meal kit service.

## 🎯 Overview

The favorites functionality allows authenticated users to:
- Add meals to their personal favorites list
- Remove meals from favorites
- View all their favorite meals with search and filtering
- Get statistics about their favorites
- See popular favorite meals across all users

## 📦 Components Implemented

### 1. Database Layer

#### Migration Script
- **File**: `database/migrations/add-favorite-table.sql`
- **Purpose**: Creates the `favorite` table with proper constraints and indexes
- **Features**:
  - Foreign key constraints to `account` and `inventory` tables
  - Unique constraint to prevent duplicate favorites
  - Cascade delete for data consistency
  - Performance-optimized indexes

#### Database Manager
- **File**: `database/src/favoriteManager.js`
- **Purpose**: Handles all database operations for favorites
- **Methods**:
  - `addFavorite(userId, mealId)` - Add a meal to favorites
  - `removeFavorite(userId, mealId)` - Remove a meal from favorites
  - `getUserFavorites(userId, options)` - Get user's favorites with filtering
  - `isFavorited(userId, mealId)` - Check if meal is favorited
  - `getFavoriteStats(userId)` - Get user's favorite statistics
  - `getPopularFavorites(limit)` - Get most popular favorites

### 2. API Layer

#### Controller
- **File**: `backend/src/controllers/favoritesController.js`
- **Purpose**: Handles HTTP requests and responses for favorites
- **Features**:
  - Input validation and sanitization
  - Error handling with appropriate HTTP status codes
  - Consistent response format

#### Routes
- **File**: `backend/src/routes/favorites.js`
- **Purpose**: Defines API endpoints for favorites functionality
- **Endpoints**:
  - `POST /api/favorites` - Add favorite
  - `DELETE /api/favorites/:meal_id` - Remove favorite
  - `GET /api/favorites` - Get user's favorites
  - `GET /api/favorites/check/:meal_id` - Check favorite status
  - `GET /api/favorites/stats` - Get favorite statistics
  - `GET /api/favorites/popular` - Get popular favorites

#### Middleware
- **File**: `backend/src/middleware/validation.js`
- **Purpose**: Validates API requests using express-validator

### 3. Testing Suite

#### Database Tests
- **File**: `database/test/test-favorite-manager.js`
- **Purpose**: Comprehensive testing of FavoriteManager functionality
- **Coverage**: All manager methods, error cases, edge cases

#### API Tests
- **File**: `backend/test/test-favorites-api.js`
- **Purpose**: End-to-end testing of API endpoints
- **Coverage**: Authentication, validation, error handling, response formats

#### Test Runner
- **File**: `test-favorites.js`
- **Purpose**: Orchestrates all tests in proper sequence
- **Features**: Migration → Manager Tests → API Tests

## 🚀 Getting Started

### Prerequisites
- PostgreSQL database running
- Node.js installed
- Project dependencies installed
- Database initialized with `account` and `inventory` tables

### Quick Setup

1. **Run Database Migration**:
   ```bash
   # Windows
   run-migration.bat
   
   # Or manually
   cd database
   node run-favorite-migration.js
   ```

2. **Run Complete Test Suite**:
   ```bash
   # Windows
   run-favorites-tests.bat
   
   # Or manually
   node test-favorites.js
   ```

3. **Start Backend Server**:
   ```bash
   cd backend
   npm start
   ```

### Individual Test Commands

```bash
# Run only migration
node test-favorites.js --migration

# Run only manager tests
node test-favorites.js --manager

# Run only API tests
node test-favorites.js --api
```

## 📊 Database Schema

```sql
CREATE TABLE favorite (
    favorite_id SERIAL PRIMARY KEY,
    meal_id INTEGER NOT NULL REFERENCES inventory(meal_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES account(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(meal_id, user_id)
);
```

**Indexes Created**:
- `idx_favorite_user_id` - Fast user-specific queries
- `idx_favorite_meal_id` - Fast meal-specific queries  
- `idx_favorite_user_meal` - Fast duplicate checks
- `idx_favorite_created_at` - Fast sorting by date

## 🌐 API Endpoints

### Authentication Required
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints Reference

#### Add Favorite
```http
POST /api/favorites
Content-Type: application/json

{
  "meal_id": 5
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Meal added to favorites successfully",
  "data": {
    "favorite_id": 1,
    "meal_id": 5,
    "user_id": 123,
    "created_at": "2025-06-23T10:30:00Z"
  }
}
```

#### Remove Favorite
```http
DELETE /api/favorites/5
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Meal removed from favorites successfully"
}
```

#### Get User Favorites
```http
GET /api/favorites?search=chicken&sort=meal_name&order=asc
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "favorite_id": 1,
      "meal_id": 5,
      "meal_name": "Grilled Chicken Salad",
      "description": "Fresh grilled chicken with mixed greens",
      "price": 12.99,
      "category": "Salads",
      "dietary_options": "Gluten-Free,High-Protein",
      "image_url": "https://example.com/image.jpg",
      "favorited_at": "2025-06-23T10:30:00Z"
    }
  ],
  "total_count": 1
}
```

#### Check Favorite Status
```http
GET /api/favorites/check/5
```

**Response (200)**:
```json
{
  "success": true,
  "is_favorite": true,
  "favorite_id": 1,
  "created_at": "2025-06-23T10:30:00Z"
}
```

#### Get Favorite Statistics
```http
GET /api/favorites/stats
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "total_favorites": 5,
    "unique_categories": 3,
    "average_price": 13.45,
    "most_recent_favorite": "2025-06-23T10:30:00Z",
    "first_favorite": "2025-06-20T08:15:00Z",
    "categories": {
      "Salads": 2,
      "Pasta": 1,
      "Seafood": 2
    }
  }
}
```

## 🔒 Security Features

- **Authentication Required**: All endpoints require valid JWT token
- **User Isolation**: Users can only access their own favorites
- **Input Validation**: All inputs validated and sanitized
- **SQL Injection Prevention**: Parameterized queries used throughout
- **Rate Limiting**: Inherited from main app configuration

## 📈 Performance Optimizations

- **Database Indexes**: Optimized for common query patterns
- **Query Optimization**: Efficient JOIN operations for favorite details
- **Pagination Ready**: API supports search and filtering
- **Connection Pooling**: Inherited from database connection setup

## 🛠️ Error Handling

### Database Errors
- **Duplicate Favorites**: `ALREADY_FAVORITED` (409)
- **Non-existent Meals**: `MEAL_NOT_FOUND` (404)
- **Non-existent Favorites**: `FAVORITE_NOT_FOUND` (404)

### API Errors
- **Authentication**: `401 Unauthorized`
- **Validation**: `400 Bad Request` with detailed field errors
- **Server Errors**: `500 Internal Server Error`

### Example Error Response
```json
{
  "success": false,
  "message": "Meal is already in your favorites",
  "error_code": "ALREADY_FAVORITED"
}
```

## 🧪 Testing Coverage

### Database Manager Tests
- ✅ Add favorite functionality
- ✅ Remove favorite functionality
- ✅ Duplicate favorite handling
- ✅ Non-existent meal handling
- ✅ User favorites retrieval
- ✅ Search and filtering
- ✅ Sorting functionality
- ✅ Favorite status checking
- ✅ Statistics calculation
- ✅ Popular favorites
- ✅ Data consistency

### API Tests
- ✅ Authentication requirements
- ✅ Input validation
- ✅ Response formats
- ✅ Error handling
- ✅ HTTP status codes
- ✅ Edge cases

## 🔄 Integration Notes

### Frontend Integration (When Ready)
The backend is ready for frontend integration. Key points:

1. **Authentication**: Ensure JWT token is included in requests
2. **Error Handling**: Handle all error codes appropriately
3. **Loading States**: API responses are fast but show loading for better UX
4. **Real-time Updates**: Consider WebSocket for live favorite updates
5. **Offline Support**: Cache favorites locally for offline viewing

### Current Frontend State
- Heart icons already implemented in MealCard components
- localStorage currently used for favorites (not connected to backend)
- Ready for backend integration when frontend development resumes

## 📝 Future Enhancements

- **Favorite Collections**: Group favorites into custom lists
- **Sharing**: Share favorite lists with other users
- **Recommendations**: ML-based recommendations from favorites
- **Export**: Export favorites to PDF or other formats
- **Notifications**: Alert users about favorites on sale
- **Bulk Operations**: Add/remove multiple favorites at once

## 🔧 Troubleshooting

### Common Issues

1. **Migration Fails**
   - Check database connection
   - Ensure PostgreSQL is running
   - Verify credentials in .env file

2. **Tests Fail**
   - Ensure database has sample data
   - Check backend server is running (for API tests)
   - Verify all dependencies installed

3. **API Returns 401**
   - Check JWT token validity
   - Ensure authentication middleware is working
   - Verify user exists in database

### Debug Commands
```bash
# Check database connection
node -e "require('./database/src/connect').query('SELECT NOW()')"

# Check table exists
node -e "require('./database/src/connect').query('SELECT * FROM favorite LIMIT 1')"

# Test API endpoint directly
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/favorites
```

## 📞 Support

For issues or questions about the favorites implementation:
1. Check the troubleshooting section above
2. Run the test suite to identify specific problems
3. Review error logs for detailed error messages
4. Ensure all prerequisites are met
