const express = require('express');
const router = express.Router();
const glucoseController = require('../controllers/glucoseController');
const { verifyToken } = require('../middleware/auth');

// All glucose routes require authentication
router.post('/', verifyToken, glucoseController.createReading);
router.get('/', verifyToken, glucoseController.getReadings);
router.delete('/:id', verifyToken, glucoseController.deleteReading);

module.exports = router;
