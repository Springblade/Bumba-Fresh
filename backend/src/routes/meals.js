const express = require('express');
const { InventoryManager } = require('../../../database/src');
const router = express.Router();

/**
 * GET /api/meals
 * Get all available meals from inventory
 */
router.get('/', async (req, res) => {
  try {
    const meals = await InventoryManager.getAllMeals();
    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meals',
      error: error.message
    });
  }
});

/**
 * GET /api/meals/:id
 * Get specific meal by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await InventoryManager.getMealById(parseInt(id));
    
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.json({
      success: true,
      data: meal
    });
  } catch (error) {
    console.error('Error fetching meal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meal',
      error: error.message
    });
  }
});

/**
 * GET /api/meals/category/:category
 * Get meals by category
 */
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const meals = await InventoryManager.getMealsByCategory(category);
    
    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    console.error('Error fetching meals by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meals by category',
      error: error.message
    });
  }
});

module.exports = router;
