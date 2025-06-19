const express = require('express');
const { body, param, query } = require('express-validator');
const mealsController = require('../controllers/mealsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation rules
const addMealValidation = [
  body('meal')
    .notEmpty()
    .withMessage('Meal name is required')
    .isLength({ max: 255 })
    .withMessage('Meal name must be less than 255 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  
  body('dietaryInfo')
    .optional()
    .isArray()
    .withMessage('Dietary info must be an array'),
  
  body('prepTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Prep time must be a non-negative integer'),
  
  body('calories')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Calories must be a non-negative integer'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL')
];

const updateMealValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Meal ID must be a positive integer'),
  
  ...addMealValidation,
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const mealIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Meal ID must be a positive integer')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a non-negative number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a non-negative number'),
  
  query('sortBy')
    .optional()
    .isIn(['meal', 'price', 'category', 'calories', 'prep_time', 'created_at'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC', 'asc', 'desc'])
    .withMessage('Sort order must be ASC or DESC')
];

// Public routes
router.get('/', queryValidation, mealsController.getAllMeals);
router.get('/categories', mealsController.getCategories);
router.get('/dietary-options', mealsController.getDietaryOptions);
router.get('/:id', mealIdValidation, mealsController.getMealById);

// Protected routes (require authentication)
router.post('/', authMiddleware, addMealValidation, mealsController.addMeal);
router.put('/:id', authMiddleware, updateMealValidation, mealsController.updateMeal);

module.exports = router;
