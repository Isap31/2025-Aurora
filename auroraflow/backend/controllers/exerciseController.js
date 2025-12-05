const memoryStore = require('../storage/memoryStore');

// Create a new exercise entry
const createExercise = async (req, res) => {
  try {
    const { activityType, duration, timestamp, notes } = req.body;
    const userId = req.userId; // from JWT middleware

    // Validate activity type
    if (!activityType || activityType.trim() === '') {
      return res.status(400).json({
        error: 'Activity type is required',
      });
    }

    // Validate duration
    if (!duration || duration < 1 || duration > 600) {
      return res.status(400).json({
        error: 'Invalid duration. Must be between 1 and 600 minutes',
      });
    }

    // Validate timestamp
    if (!timestamp) {
      return res.status(400).json({
        error: 'Timestamp is required',
      });
    }

    // Create exercise in memory store
    const exercise = await memoryStore.createExercise(
      userId,
      activityType,
      duration,
      timestamp,
      notes
    );

    res.status(201).json({
      success: true,
      exercise: exercise,
    });
  } catch (error) {
    console.error('Create exercise error:', error);
    res.status(500).json({
      error: 'Failed to create exercise entry',
      message: error.message,
    });
  }
};

// Get all exercises for the authenticated user
const getExercises = async (req, res) => {
  try {
    const userId = req.userId; // from JWT middleware

    // Get exercises from memory store
    const exercises = await memoryStore.getExercises(userId);

    res.status(200).json({
      success: true,
      exercises: exercises,
      count: exercises.length,
    });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({
      error: 'Failed to fetch exercises',
      message: error.message,
    });
  }
};

// Delete an exercise
const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // from JWT middleware

    if (!id) {
      return res.status(400).json({
        error: 'Exercise ID is required',
      });
    }

    // Delete from memory store
    const deleted = await memoryStore.deleteExercise(userId, id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Exercise not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exercise deleted successfully',
      id: deleted.id,
    });
  } catch (error) {
    console.error('Delete exercise error:', error);
    res.status(500).json({
      error: 'Failed to delete exercise',
      message: error.message,
    });
  }
};

module.exports = {
  createExercise,
  getExercises,
  deleteExercise,
};
