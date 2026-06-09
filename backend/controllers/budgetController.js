const Budget = require('../models/Budget');

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBudget = async (req, res) => {
  try {
    const { category, limit, period, startDate, endDate } = req.body;
    const budget = await Budget.create({
      user: req.user.id, category, limit, period, startDate, endDate
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBudgets, createBudget };