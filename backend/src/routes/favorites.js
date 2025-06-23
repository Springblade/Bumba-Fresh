const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Updated to use correct auth middleware
const {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavoriteStats,
  getPopularMeals,
  addFavoriteValidation,
  removeFavoriteValidation,
  checkFavoriteValidation,
  getUserFavoritesValidation,
  getPopularMealsValidation
} = require('../controllers/favoritesController');

/**
 * Favorites Routes
 * Base URL: /api/favorites
 */

/**
 * GET /api/favorites
 * Get all favorites for the authenticated user
 */
router.get('/', 
  authMiddleware,
  getUserFavoritesValidation,
  getUserFavorites
);

/**
 * POST /api/favorites
 * Add a meal to user's favorites
 */
router.post('/', 
  authMiddleware,
  addFavoriteValidation,
  addFavorite
);

/**
 * DELETE /api/favorites/:meal_id
 * Remove a meal from user's favorites
 */
router.delete('/:meal_id', 
  authMiddleware,
  removeFavoriteValidation,
  removeFavorite
);

/**
 * GET /api/favorites/check/:meal_id
 * Check if a specific meal is in user's favorites
 */
router.get('/check/:meal_id', 
  authMiddleware,
  checkFavoriteValidation,
  checkFavorite
);

/**
 * GET /api/favorites/stats
 * Get user's favorite statistics
 */
router.get('/stats', 
  authMiddleware,
  getFavoriteStats
);

/**
 * GET /api/favorites/popular
 * Get most favorited meals (public endpoint - no auth required)
 */
router.get('/popular', 
  getPopularMealsValidation,
  getPopularMeals
);

module.exports = router;
