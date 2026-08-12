import Budget from '../models/Budget.js';

// Get all budgets for the logged-in user
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching budgets' });
  }
};

// Create a new budget
export const createBudget = async (req, res) => {
  try {
    const { category, limit, period } = req.body;

    const budget = new Budget({
      user: req.user._id,
      category,
      limit,
      period,
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating budget' });
  }
};