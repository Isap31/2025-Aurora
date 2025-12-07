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

// Get recent glucose readings (for dashboard)
const getRecentReadings = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 5;

    const readings = await memoryStore.getReadings(userId);
    const sortedReadings = readings
      .sort((a, b) => new Date(b.reading_time || b.timestamp) - new Date(a.reading_time || a.timestamp))
      .slice(0, limit);

    res.status(200).json(sortedReadings);
  } catch (error) {
    console.error('Get recent readings error:', error);
    res.status(500).json({
      error: 'Failed to fetch recent glucose readings',
      message: error.message,
    });
  }
};

// Get glucose statistics
const getStats = async (req, res) => {
  try {
    const userId = req.userId;
    const days = parseInt(req.query.days) || 7;

    const readings = await memoryStore.getReadings(userId);

    // Filter readings within the specified days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filteredReadings = readings.filter(r =>
      new Date(r.reading_time || r.timestamp) >= cutoffDate
    );

    if (filteredReadings.length === 0) {
      return res.status(200).json({
        average: 0,
        timeInRange: 0,
        count: 0
      });
    }

    // Calculate average (support both glucose_level and value fields)
    const sum = filteredReadings.reduce((acc, r) => acc + (r.glucose_level || r.value), 0);
    const average = sum / filteredReadings.length;

    // Calculate time in range (70-180 mg/dL)
    const inRange = filteredReadings.filter(r => {
      const level = r.glucose_level || r.value;
      return level >= 70 && level <= 180;
    });
    const timeInRange = (inRange.length / filteredReadings.length) * 100;

    res.status(200).json({
      average,
      timeInRange,
      count: filteredReadings.length,
      min: Math.min(...filteredReadings.map(r => r.glucose_level || r.value)),
      max: Math.max(...filteredReadings.map(r => r.glucose_level || r.value))
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch glucose statistics',
      message: error.message,
    });
  }
};

module.exports = {
  createReading,
  getReadings,
  deleteReading,
  getRecentReadings,
  getStats,
};
