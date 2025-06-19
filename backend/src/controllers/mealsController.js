const { query } = require('../config/database');
const { validationResult } = require('express-validator');

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

    let queryText = `
      SELECT meal_id, meal, description, quantity, price, category, 
             dietary_info, prep_time, calories, image_url, is_active,
             created_at, updated_at
      FROM inventory 
      WHERE is_active = true
    `;
    
    const queryParams = [];
    let paramCount = 0;

    // Add filters
    if (category) {
      paramCount++;
      queryText += ` AND category = $${paramCount}`;
      queryParams.push(category);
    }

    if (dietary) {
      paramCount++;
      queryText += ` AND $${paramCount} = ANY(dietary_info)`;
      queryParams.push(dietary);
    }

    if (minPrice) {
      paramCount++;
      queryText += ` AND price >= $${paramCount}`;
      queryParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      queryText += ` AND price <= $${paramCount}`;
      queryParams.push(parseFloat(maxPrice));
    }

    if (search) {
      paramCount++;
      queryText += ` AND (meal ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Add sorting
    const allowedSortFields = ['meal', 'price', 'category', 'calories', 'prep_time', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'meal';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    queryText += ` ORDER BY ${sortField} ${order}`;

    // Add pagination
    const offset = (page - 1) * limit;
    paramCount++;
    queryText += ` LIMIT $${paramCount}`;
    queryParams.push(parseInt(limit));
    
    paramCount++;
    queryText += ` OFFSET $${paramCount}`;
    queryParams.push(offset);

    const result = await query(queryText, queryParams);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) FROM inventory WHERE is_active = true`;
    const countParams = [];
    let countParamIndex = 0;

    if (category) {
      countParamIndex++;
      countQuery += ` AND category = $${countParamIndex}`;
      countParams.push(category);
    }

    if (dietary) {
      countParamIndex++;
      countQuery += ` AND $${countParamIndex} = ANY(dietary_info)`;
      countParams.push(dietary);
    }

    if (minPrice) {
      countParamIndex++;
      countQuery += ` AND price >= $${countParamIndex}`;
      countParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      countParamIndex++;
      countQuery += ` AND price <= $${countParamIndex}`;
      countParams.push(parseFloat(maxPrice));
    }

    if (search) {
      countParamIndex++;
      countQuery += ` AND (meal ILIKE $${countParamIndex} OR description ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      meals: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get meals error:', error);
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

    const result = await query(
      `SELECT meal_id, meal, description, quantity, price, category, 
              dietary_info, prep_time, calories, image_url, is_active,
              created_at, updated_at
       FROM inventory 
       WHERE meal_id = $1 AND is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Meal not found',
        message: 'The requested meal does not exist or is not available'
      });
    }

    res.json({
      meal: result.rows[0]
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

    const result = await query(
      `INSERT INTO inventory (meal, description, quantity, price, category, dietary_info, prep_time, calories, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING meal_id, meal, description, quantity, price, category, dietary_info, prep_time, calories, image_url, created_at`,
      [meal, description, quantity, price, category, dietaryInfo, prepTime, calories, imageUrl]
    );

    res.status(201).json({
      message: 'Meal added successfully',
      meal: result.rows[0]
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
