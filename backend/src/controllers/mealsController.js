const { validationResult } = require('express-validator');
const { InventoryManager } = require('../../../database/src');

/**
 * Get all meals with optional filtering
 * Enhanced version of inventory browsing
 */
const getAllMeals = async (req, res) => {
  try {
    const { 
      category, 
      dietary, 
      minPrice, 
      maxPrice, 
      search, 
      sortBy = 'meal', 
      sortOrder = 'ASC',
      page = 1,
      limit = 20
    } = req.query;

    // Prepare filters for the database layer
    const filters = {};
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (dietary) filters.dietary = dietary;
    if (search) filters.search = search;

    // Use InventoryManager to get meals
    const meals = await InventoryManager.getAllMeals(filters);

    // Apply sorting and pagination (could be moved to database layer)
    let filteredMeals = meals;

    // Search filter (simple text search)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMeals = filteredMeals.filter(meal => 
        meal.meal.toLowerCase().includes(searchLower) ||
        (meal.description && meal.description.toLowerCase().includes(searchLower))
      );
    }

    // Dietary filter
    if (dietary) {
      filteredMeals = filteredMeals.filter(meal => 
        meal.dietary_info && meal.dietary_info.includes(dietary)
      );
    }

    // Sorting
    filteredMeals.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'DESC') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Pagination
    const offset = (page - 1) * limit;
    const paginatedMeals = filteredMeals.slice(offset, offset + parseInt(limit));

    res.json({
      meals: paginatedMeals,
      pagination: {
        currentPage: parseInt(page),
        totalItems: filteredMeals.length,
        totalPages: Math.ceil(filteredMeals.length / limit),
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch meals'
    });
  }
};

/**
 * Get meal by ID
 */
const getMealById = async (req, res) => {
  try {
    const { id } = req.params;

    // Use InventoryManager to get meal by ID
    const meal = await InventoryManager.getMealById(parseInt(id));

    if (!meal) {
      return res.status(404).json({
        error: 'Meal not found',
        message: 'The requested meal does not exist or is not available'
      });
    }

    res.json({
      meal: meal
    });

  } catch (error) {
    console.error('Get meal by ID error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch meal'
    });
  }
};

/**
 * Add new meal to inventory
 * Enhanced version of Inventory_Management.java add_mealkit method
 */
const addMeal = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      meal,
      description,
      quantity,
      price,
      category,
      dietaryInfo,
      prepTime,
      calories,
      imageUrl
    } = req.body;

    // Use InventoryManager to add meal
    const result = await InventoryManager.addMealKit(
      meal, 
      description, 
      quantity, 
      price, 
      category, 
      dietaryInfo, 
      prepTime, 
      calories, 
      imageUrl
    );

    if (!result.success) {
      return res.status(400).json({
        error: 'Failed to add meal',
        message: result.error
      });
    }

    res.status(201).json({
      message: 'Meal added successfully',
      meal: result.meal
    });

  } catch (error) {
    console.error('Add meal error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to add meal'
    });
  }
};

/**
 * Update meal inventory
 */
const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      meal,
      description,
      quantity,
      price,
      category,
      dietaryInfo,
      prepTime,
      calories,
      imageUrl,
      isActive
    } = req.body;

    const result = await query(
      `UPDATE inventory 
       SET meal = $1, description = $2, quantity = $3, price = $4, category = $5, 
           dietary_info = $6, prep_time = $7, calories = $8, image_url = $9, is_active = $10, 
           updated_at = CURRENT_TIMESTAMP
       WHERE meal_id = $11 
       RETURNING meal_id, meal, description, quantity, price, category, dietary_info, prep_time, calories, image_url, is_active, updated_at`,
      [meal, description, quantity, price, category, dietaryInfo, prepTime, calories, imageUrl, isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Meal not found',
        message: 'The requested meal does not exist'
      });
    }

    res.json({
      message: 'Meal updated successfully',
      meal: result.rows[0]
    });

  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update meal'
    });
  }
};

/**
 * Get meal categories
 */
const getCategories = async (req, res) => {
  try {
    const result = await query(
      `SELECT DISTINCT category, COUNT(*) as meal_count 
       FROM inventory 
       WHERE is_active = true AND category IS NOT NULL 
       GROUP BY category 
       ORDER BY category`
    );

    res.json({
      categories: result.rows
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch categories'
    });
  }
};

/**
 * Get dietary options
 */
const getDietaryOptions = async (req, res) => {
  try {
    const result = await query(
      `SELECT DISTINCT UNNEST(dietary_info) as dietary_option, COUNT(*) as meal_count
       FROM inventory 
       WHERE is_active = true AND dietary_info IS NOT NULL 
       GROUP BY dietary_option 
       ORDER BY dietary_option`
    );

    res.json({
      dietaryOptions: result.rows
    });

  } catch (error) {
    console.error('Get dietary options error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch dietary options'
    });
  }
};

module.exports = {
  getAllMeals,
  getMealById,
  addMeal,
  updateMeal,
  getCategories,
  getDietaryOptions
};
