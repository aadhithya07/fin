const express = require('express');
const router = express.Router();
const { getExpenses, addExpense } = require('../controllers/expenseController');

// We import your auth middleware to ensure only logged-in users can do this
const { protect } = require('../middleware/authMiddleware'); 

router.get('/', protect, getExpenses);
router.post('/', protect, addExpense);

module.exports = router;