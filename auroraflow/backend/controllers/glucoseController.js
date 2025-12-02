const db = require('../config/database');

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

    // Insert glucose reading into database
    const query = `
      INSERT INTO glucose_readings (user_id, glucose_level, reading_time, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, glucose_level, reading_time, notes, created_at
    `;

    const result = await db.query(query, [
      userId,
      value,
      timestamp,
      notes || null,
    ]);

    res.status(201).json({
      success: true,
      reading: result.rows[0],
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

    // Get readings ordered by newest first
    const query = `
      SELECT id, user_id, glucose_level, reading_time, notes, created_at
      FROM glucose_readings
      WHERE user_id = $1
      ORDER BY reading_time DESC
    `;

    const result = await db.query(query, [userId]);

    res.status(200).json({
      success: true,
      readings: result.rows,
      count: result.rows.length,
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

    // Delete only if the reading belongs to the user
    const query = `
      DELETE FROM glucose_readings
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;

    const result = await db.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Reading not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reading deleted successfully',
      id: result.rows[0].id,
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
