const Income = require('../models/Income');

const getIncome = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addIncome = async (req, res) => {
  try {
    const { source, amount, date, description } = req.body;
    const income = await Income.create({
      user: req.user.id, source, amount, date, description
    });
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getIncome, addIncome };
