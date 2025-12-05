const express = require('express');
const router = express.Router();
const glucoseController = require('../controllers/glucoseController');
const { optionalAuth } = require('../middleware/auth');

// Glucose routes with optional authentication (supports guest mode)
router.post('/', optionalAuth, glucoseController.createReading);
router.get('/', optionalAuth, glucoseController.getReadings);
router.delete('/:id', optionalAuth, glucoseController.deleteReading);

module.exports = router;
