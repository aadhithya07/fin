const express = require('express');
const router = express.Router();
const { getIncome, addIncome } = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getIncome).post(protect, addIncome);

module.exports = router;