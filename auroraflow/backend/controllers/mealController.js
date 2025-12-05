const memoryStore = require('../storage/memoryStore');

// Create a new meal entry
const createMeal = async (req, res) => {
  try {
    const { foodName, carbs, timestamp, notes } = req.body;
    const userId = req.userId; // from JWT middleware

    // Validate food name
    if (!foodName || foodName.trim() === '') {
      return res.status(400).json({
        error: 'Food name is required',
      });
    }

    // Validate carbs
    if (!carbs || carbs < 0 || carbs > 500) {
      return res.status(400).json({
        error: 'Invalid carbs value. Must be between 0 and 500g',
      });
    }

    // Validate timestamp
    if (!timestamp) {
      return res.status(400).json({
        error: 'Timestamp is required',
      });
    }

    // Create meal in memory store
    const meal = await memoryStore.createMeal(
      userId,
      foodName,
      carbs,
      timestamp,
      notes
    );

    res.status(201).json({
      success: true,
      meal: meal,
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({
      error: 'Failed to create meal entry',
      message: error.message,
    });
  }
};

// Get all meals for the authenticated user
const getMeals = async (req, res) => {
  try {
    const userId = req.userId; // from JWT middleware

    // Get meals from memory store
    const meals = await memoryStore.getMeals(userId);

    res.status(200).json({
      success: true,
      meals: meals,
      count: meals.length,
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({
      error: 'Failed to fetch meals',
      message: error.message,
    });
  }
};

// Delete a meal
const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // from JWT middleware

    if (!id) {
      return res.status(400).json({
        error: 'Meal ID is required',
      });
    }

    // Delete from memory store
    const deleted = await memoryStore.deleteMeal(userId, id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Meal not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully',
      id: deleted.id,
    });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({
      error: 'Failed to delete meal',
      message: error.message,
    });
  }
};

module.exports = {
  createMeal,
  getMeals,
  deleteMeal,
};
