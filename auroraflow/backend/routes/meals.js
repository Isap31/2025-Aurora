const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const { optionalAuth } = require('../middleware/auth');

// Meal routes with optional authentication (supports guest mode)
router.post('/', optionalAuth, mealController.createMeal);
router.get('/', optionalAuth, mealController.getMeals);
router.delete('/:id', optionalAuth, mealController.deleteMeal);

module.exports = router;
