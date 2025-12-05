const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { optionalAuth } = require('../middleware/auth');

// Exercise routes with optional authentication (supports guest mode)
router.post('/', optionalAuth, exerciseController.createExercise);
router.get('/', optionalAuth, exerciseController.getExercises);
router.delete('/:id', optionalAuth, exerciseController.deleteExercise);

module.exports = router;
