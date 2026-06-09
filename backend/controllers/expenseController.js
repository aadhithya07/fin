const Expense = require('../models/expenseModel');

// GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    // Finds only the expenses belonging to the logged-in user
    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch expenses' });
  }
};

// POST /api/expenses
const addExpense = async (req, res) => {
  try {
    const { description, amount, category } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const expense = await Expense.create({
      user: req.user.id,
      description,
      amount,
      category
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not add expense' });
  }
};

module.exports = { getExpenses, addExpense };