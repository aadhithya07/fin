const express = require('express');
const router = express.Router();

// NOTE: If you have a budgetController, uncomment these lines and use them!
// const { getBudgets, createBudget } = require('../controllers/budgetController');
// const { protect } = require('../middleware/authMiddleware');

// router.route('/').get(protect, getBudgets).post(protect, createBudget);

// --- FAILSAFE ROUTES ---
// If you haven't built the controller yet, leave these failsafe routes active 
// so the server doesn't crash while we build the rest of the app:
router.get('/', (req, res) => {
    res.status(200).json([]);
});

router.post('/', (req, res) => {
    res.status(201).json(req.body);
});

module.exports = router; // <-- THIS LINE PREVENTS THE CRASH