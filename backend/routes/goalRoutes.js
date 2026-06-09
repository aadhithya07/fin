const express = require('express');
const router = express.Router();
const { getGoals, createGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getGoals).post(protect, createGoal);

module.exports = router;