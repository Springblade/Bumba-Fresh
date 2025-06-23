const { FavoriteManager } = require('../../../database/src');
const { body, param, query, validationResult } = require('express-validator');

/**
 * Favorites Controller
 * Handles all favorite-related API endpoints
 */

/**
 * GET /api/favorites
 * Get all favorites for the authenticated user
 */
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, category, sort, order, page = 1, limit = 20 } = req.query;
    
    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const options = {
      search: search || null,
      category: category || null,
      sort: sort || 'created_at',
      order: order || 'desc',
      limit: parseInt(limit),
      offset: offset
    };

    const favorites = await FavoriteManager.getUserFavorites(userId, options);
    const totalCount = await FavoriteManager.getUserFavoritesCount(userId);
    
    res.json({
      success: true,
      data: favorites,
      pagination: {
        current_page: parseInt(page),
        total_count: totalCount,
        per_page: parseInt(limit),
        total_pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites',
      error: error.message
    });
  }
};

/**
 * POST /api/favorites
 * Add a meal to user's favorites
 */
const addFavorite = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { meal_id } = req.body;

    const result = await FavoriteManager.addFavorite(userId, meal_id);
    
    if (!result.success) {
      const statusCode = result.error === 'MEAL_NOT_FOUND' ? 404 :
                        result.error === 'ALREADY_FAVORITED' ? 409 : 400;
      
      return res.status(statusCode).json({
        success: false,
        message: result.message,
        error_code: result.error
      });
    }

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add favorite',
      error: error.message
    });
  }
};

/**
 * DELETE /api/favorites/:meal_id
 * Remove a meal from user's favorites
 */
const removeFavorite = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { meal_id } = req.params;

    const result = await FavoriteManager.removeFavorite(userId, parseInt(meal_id));
    
    if (!result.success) {
      const statusCode = result.error === 'FAVORITE_NOT_FOUND' ? 404 : 400;
      
      return res.status(statusCode).json({
        success: false,
        message: result.message,
        error_code: result.error
      });
    }

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove favorite',
      error: error.message
    });
  }
};

/**
 * GET /api/favorites/check/:meal_id
 * Check if a specific meal is in user's favorites
 */
const checkFavorite = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { meal_id } = req.params;

    const result = await FavoriteManager.checkFavorite(userId, parseInt(meal_id));
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to check favorite status',
        error: result.error
      });
    }

    res.json({
      success: true,
      is_favorite: result.is_favorite,
      data: result.data
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check favorite status',
      error: error.message
    });
  }
};

/**
 * GET /api/favorites/stats
 * Get user's favorite statistics
 */
const getFavoriteStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await FavoriteManager.getUserFavoriteStats(userId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get favorite stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorite statistics',
      error: error.message
    });
  }
};

/**
 * GET /api/favorites/popular
 * Get most favorited meals (public endpoint)
 */
const getPopularMeals = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;
    
    const options = {
      limit: parseInt(limit),
      category: category || null
    };

    const popularMeals = await FavoriteManager.getMostFavoritedMeals(options);

    res.json({
      success: true,
      data: popularMeals
    });
  } catch (error) {
    console.error('Get popular meals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular meals',
      error: error.message
    });
  }
};

// Validation rules
const addFavoriteValidation = [
  body('meal_id')
    .isInt({ min: 1 })
    .withMessage('Meal ID must be a positive integer')
];

const removeFavoriteValidation = [
  param('meal_id')
    .isInt({ min: 1 })
    .withMessage('Meal ID must be a positive integer')
];

const checkFavoriteValidation = [
  param('meal_id')
    .isInt({ min: 1 })
    .withMessage('Meal ID must be a positive integer')
];

const getUserFavoritesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['meal_name', 'price', 'created_at', 'favorited_at'])
    .withMessage('Sort field must be one of: meal_name, price, created_at, favorited_at'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either asc or desc')
];

const getPopularMealsValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavoriteStats,
  getPopularMeals,
  // Validation middleware
  addFavoriteValidation,
  removeFavoriteValidation,
  checkFavoriteValidation,
  getUserFavoritesValidation,
  getPopularMealsValidation
};
