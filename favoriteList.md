# Favorite List Feature Specification

## Overview
The favorite list feature allows authenticated users to manage a personal collection of favorite meals. Users can add meals to their favorites, remove them, view their complete list, and search through their favorites. This feature enhances user experience by providing quick access to preferred meals for future orders.

## Current Implementation Analysis
The frontend already has a heart icon button implemented in `MealCard` components that:
- Uses localStorage to store favorite meal IDs (`likedMeals` array)
- Provides visual feedback (red filled heart for favorites, gray outline for non-favorites)
- Located in top-right corner of meal images
- No backend integration currently exists
- Favorites are lost when switching browsers/devices
- Not tied to user authentication

## Business Requirements

### User Stories
1. **As a user**, I want to add meals to my favorites so I can easily find them later
2. **As a user**, I want to remove meals from my favorites when I no longer want them saved
3. **As a user**, I want to view all my favorite meals in one place
4. **As a user**, I want to search through my favorite meals to quickly find specific items
5. **As a user**, I want to see if a meal is already in my favorites when browsing meals

### Functional Requirements
- Users must be authenticated to access favorite functionality
- Each user can have multiple favorite meals
- Multiple users can favorite the same meal
- Users can only manage their own favorites
- Favorites should include full meal details (name, description, price, etc.)
- System should handle duplicate favorite attempts gracefully
- System should validate that meals exist before adding to favorites

## Database Schema

### New Table: `favorite`
```sql
CREATE TABLE favorite (
    favorite_id SERIAL PRIMARY KEY,
    meal_id INTEGER NOT NULL REFERENCES inventory(meal_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES account(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(meal_id, user_id)
);
```

**Fields:**
- `favorite_id`: Primary key for the favorite record
- `meal_id`: Foreign key referencing `inventory.meal_id` (with CASCADE delete)
- `user_id`: Foreign key referencing `account.user_id` (with CASCADE delete)
- `created_at`: Timestamp when the favorite was added
- **Unique constraint**: Prevents duplicate favorites for the same user-meal combination

**Indexes:**
- `idx_favorite_user_id`: Index on `user_id` for fast user-specific queries
- `idx_favorite_meal_id`: Index on `meal_id` for meal-specific queries
- `idx_favorite_user_meal`: Composite index on `(user_id, meal_id)` for duplicate checks

## User Flow

### 1. Add Favorite Flow
```
1. User views meal details or meal list (OurMeals page)
2. User clicks heart icon button in top-right corner of meal card
3. System validates:
   - User is authenticated (redirect to login if not)
   - Meal exists in inventory
   - Meal is not already in user's favorites
4. System adds favorite record to database
5. Frontend updates heart icon to filled red state
6. User receives toast notification: "Added to favorites"
7. localStorage is updated as backup/cache
```

### 2. Remove Favorite Flow  
```
1. User views meal with filled red heart icon or favorites list
2. User clicks filled heart icon or "Remove" button
3. System validates:
   - User is authenticated
   - Favorite exists for this user-meal combination
4. System removes favorite record from database
5. Frontend updates heart icon to gray outline state
6. User receives toast notification: "Removed from favorites"
7. localStorage is updated to reflect changes
8. If on favorites page, meal card is removed with smooth animation
```

### 3. View Favorites Flow
```
1. User navigates to favorites page via:
   - Header navigation link "My Favorites"
   - User profile dropdown menu
   - Direct URL access (/favorites)
2. System validates user is authenticated (redirect if not)
3. System retrieves all user's favorites with meal details via API
4. Loading state displayed while fetching data
5. System displays favorites in responsive grid layout:
   - Meal cards similar to main meals page
   - Each card shows meal image, name, description, price
   - Heart icon shows as filled red (removable)
   - "Add to Cart" button available
   - "Remove from Favorites" action available
6. Empty state displayed if no favorites exist:
   - Illustration/icon
   - "No favorites yet" message
   - "Browse meals" CTA button linking to main meals page
7. Error handling for API failures:
   - Show error message with retry option
   - Fallback to localStorage data if available
```

### 4. Search Favorites Flow
```
1. User enters search term in favorites search bar
2. Frontend performs real-time filtering as user types
3. Search applies to multiple fields:
   - Meal name (case-insensitive)
   - Description (case-insensitive) 
   - Category (case-insensitive)
   - Tags (case-insensitive)
4. Results update dynamically with debounced input
5. Search highlights matching terms in results
6. Filter chips show active search criteria
7. Clear search option available
8. "No results found" state with search suggestions:
   - "Try different keywords"
   - Popular meal categories as quick filters
   - Option to clear search and browse all favorites
```

### 5. Sync on Login/Logout Flow
```
Login:
1. User successfully authenticates
2. System fetches user's favorites from database
3. System merges with any localStorage favorites (if applicable)
4. Conflicts resolved by preferring database state
5. Heart icons update across all visible meal cards
6. localStorage updated with merged data

Logout:
1. User logs out
2. System clears user-specific favorite state
3. Heart icons reset to unfilled state
4. localStorage cleared of user favorites
5. Any favorites page redirects to login or home
```

### 6. Offline/Error Handling Flow
```
Network Error:
1. API call fails due to network issues
2. System falls back to localStorage data
3. User sees cached favorites with indicator
4. Actions queue for retry when connection restored
5. Toast notification explains limited functionality

Database Error:
1. Database operation fails
2. User receives error notification
3. System maintains current UI state
4. Retry mechanism with exponential backoff
5. Option to refresh page or contact support
```

## API Endpoints Specification

### Base URL: `/api/favorites`

### 1. GET `/api/favorites`
**Description:** Retrieve all favorites for the authenticated user
**Authentication:** Required
**Query Parameters:**
- `search` (optional): Search term for filtering favorites
- `category` (optional): Filter by meal category
- `sort` (optional): Sort order (`name`, `price`, `created_at`) - default: `created_at`
- `order` (optional): Sort direction (`asc`, `desc`) - default: `desc`

**Response Success (200):**
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
      "image_url": "https://example.com/image.jpg",
      "created_at": "2025-06-23T10:30:00Z"
    }
  ],
  "total_count": 1
}
```

### 2. POST `/api/favorites`
**Description:** Add a meal to user's favorites
**Authentication:** Required
**Request Body:**
```json
{
  "meal_id": 5
}
```

**Response Success (201):**
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

**Response Error (409):**
```json
{
  "success": false,
  "message": "Meal is already in your favorites",
  "error_code": "ALREADY_FAVORITED"
}
```

### 3. DELETE `/api/favorites/:meal_id`
**Description:** Remove a meal from user's favorites
**Authentication:** Required
**URL Parameters:**
- `meal_id`: ID of the meal to remove from favorites

**Response Success (200):**
```json
{
  "success": true,
  "message": "Meal removed from favorites successfully"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Favorite not found",
  "error_code": "FAVORITE_NOT_FOUND"
}
```

### 4. GET `/api/favorites/check/:meal_id`
**Description:** Check if a specific meal is in user's favorites
**Authentication:** Required
**URL Parameters:**
- `meal_id`: ID of the meal to check

**Response Success (200):**
```json
{
  "success": true,
  "is_favorite": true,
  "favorite_id": 1
}
```

### 5. GET `/api/favorites/stats`
**Description:** Get user's favorite statistics
**Authentication:** Required

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "total_favorites": 5,
    "categories": {
      "Salads": 2,
      "Pasta": 1,
      "Seafood": 2
    },
    "average_price": 13.45,
    "most_recent": "2025-06-23T10:30:00Z"
  }
}
```

## Technical Implementation

### Frontend Changes Required
Update existing components to integrate with backend:

1. **Update `OurMeals.tsx` component:**
   - Replace localStorage-only favorite handling with API calls
   - Add error handling and loading states
   - Implement authentication checks
   - Add toast notifications for user feedback

2. **Update `MealCard` components:**
   - Modify `toggleLike` function to call API endpoints
   - Add loading states for heart icon during API calls
   - Implement optimistic UI updates
   - Handle API errors gracefully

3. **Create new `FavoritesPage` component:**
   - Display user's favorite meals in grid layout
   - Implement search and filter functionality
   - Handle empty states and loading states
   - Add navigation integration

4. **Update authentication context:**
   - Load user favorites on login
   - Clear favorites on logout
   - Handle authentication state changes

### Database Layer
Create the following files in `database/src/`:

1. **`favoriteManager.js`** - Main manager class following existing patterns
2. **`queries/addFavorite.js`** - Add favorite SQL query
3. **`queries/removeFavorite.js`** - Remove favorite SQL query  
4. **`queries/getFavorites.js`** - Get user favorites SQL query
5. **`queries/searchFavorites.js`** - Search favorites SQL query
6. **`queries/checkFavorite.js`** - Check if meal is favorited SQL query
7. **`queries/getFavoriteStats.js`** - Get favorite statistics SQL query

### API Layer
Create the following files in `backend/src/`:

1. **`routes/favorites.js`** - Express router with all favorite endpoints
2. **`controllers/favoritesController.js`** - Controller functions for business logic
3. **`middleware/favoriteValidation.js`** - Request validation middleware

### Database Migration
Create `database/migrations/add-favorite-table.sql` with:
- Table creation
- Index creation
- Sample data (optional)

## Error Handling

### Database Errors
- **Duplicate Key**: When trying to add already favorited meal
- **Foreign Key Violation**: When meal or user doesn't exist
- **Connection Issues**: Database connectivity problems

### API Errors
- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User trying to access others' favorites
- **404 Not Found**: Meal or favorite not found
- **409 Conflict**: Trying to add duplicate favorite
- **422 Unprocessable Entity**: Invalid request data
- **500 Internal Server Error**: Database or server errors

## Security Considerations

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Users can only access their own favorites
3. **Input Validation**: Validate meal_id exists and is numeric
4. **SQL Injection**: Use parameterized queries
5. **Rate Limiting**: Apply to prevent abuse

## Performance Considerations

1. **Database Indexes**: Create appropriate indexes for fast queries
2. **Caching**: Consider caching favorite counts and stats
3. **Pagination**: Implement for users with many favorites
4. **Query Optimization**: Use JOINs efficiently for meal details

## Testing Requirements

### Unit Tests
- Test all FavoriteManager methods
- Test API endpoints with various scenarios
- Test error handling and edge cases

### Integration Tests  
- Test database operations
- Test API authentication and authorization
- Test complete user flows

### Test Cases
1. Add favorite successfully
2. Add duplicate favorite (should fail)
3. Remove favorite successfully
4. Remove non-existent favorite (should fail)
5. View favorites with and without data
6. Search favorites with various terms
7. Check favorite status for different meals
8. Handle invalid meal IDs
9. Handle unauthenticated requests
10. Handle database connection failures

## Future Enhancements

1. **Favorite Categories**: Allow users to organize favorites into custom categories
2. **Favorite Notes**: Let users add personal notes to favorites
3. **Favorite Sharing**: Allow users to share favorite lists
4. **Favorite Recommendations**: Suggest meals based on favorites
5. **Favorite History**: Track when items were added/removed
6. **Bulk Operations**: Add/remove multiple favorites at once
7. **Export Favorites**: Allow users to export their favorite lists


