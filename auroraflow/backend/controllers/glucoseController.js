const memoryStore = require('../storage/memoryStore');

// Create a new glucose reading
const createReading = async (req, res) => {
  try {
    const { value, timestamp, notes } = req.body;
    const userId = req.userId; // from JWT middleware

    // Validate glucose value
    if (!value || value < 20 || value > 600) {
      return res.status(400).json({
        error: 'Invalid glucose value. Must be between 20 and 600 mg/dL',
      });
    }

    // Validate timestamp
    if (!timestamp) {
      return res.status(400).json({
        error: 'Timestamp is required',
      });
    }

    // Create reading in memory store
    const reading = await memoryStore.createReading(
      userId,
      value,
      timestamp,
      notes
    );

    res.status(201).json({
      success: true,
      reading: reading,
    });
  } catch (error) {
    console.error('Create reading error:', error);
    res.status(500).json({
      error: 'Failed to create glucose reading',
      message: error.message,
    });
  }
};

// Get all glucose readings for the authenticated user
const getReadings = async (req, res) => {
  try {
    const userId = req.userId; // from JWT middleware

    // Get readings from memory store
    const readings = await memoryStore.getReadings(userId);

    res.status(200).json({
      success: true,
      readings: readings,
      count: readings.length,
    });
  } catch (error) {
    console.error('Get readings error:', error);
    res.status(500).json({
      error: 'Failed to fetch glucose readings',
      message: error.message,
    });
  }
};

// Delete a glucose reading
const deleteReading = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // from JWT middleware

    if (!id) {
      return res.status(400).json({
        error: 'Reading ID is required',
      });
    }

    // Delete from memory store
    const deleted = await memoryStore.deleteReading(userId, id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Reading not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reading deleted successfully',
      id: deleted.id,
    });
  } catch (error) {
    console.error('Delete reading error:', error);
    res.status(500).json({
      error: 'Failed to delete glucose reading',
      message: error.message,
    });
  }
};

module.exports = {
  createReading,
  getReadings,
  deleteReading,
};
