const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget'); // Ensure this points to your actual Budget model file!
const { protect } = require('../middleware/authMiddleware'); // Ensure this points to your auth middleware!

// 1. GET all budgets for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id });
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching budgets' });
    }
});

// 2. POST a new budget
router.post('/', protect, async (req, res) => {
    try {
        const { category, limit, period } = req.body;
        
        // Backend validation: Prevent duplicate categories for this user
        const existingBudget = await Budget.findOne({ user: req.user._id, category });
        if (existingBudget) {
            return res.status(400).json({ message: 'Budget for this category already exists' });
        }

        const newBudget = await Budget.create({
            user: req.user._id,
            category,
            limit,
            period: period || 'Monthly'
        });
        res.status(201).json(newBudget);
    } catch (error) {
        res.status(500).json({ message: 'Server Error creating budget' });
    }
});

// 3. PUT (Update) an existing budget
router.put('/:id', protect, async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        // Security check: Ensure the logged-in user owns this budget
        if (budget.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to update this budget' });
        }

        const updatedBudget = await Budget.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Returns the newly updated document instead of the old one
        );
        res.status(200).json(updatedBudget);
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating budget' });
    }
});

// 4. DELETE a budget
router.delete('/:id', protect, async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        // Security check: Ensure the logged-in user owns this budget
        if (budget.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this budget' });
        }

        await budget.deleteOne();
        res.status(200).json({ message: 'Budget removed successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error deleting budget' });
    }
});

module.exports = router;