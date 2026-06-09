const Goal = require('../models/Goal');

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;
    const goal = await Goal.create({
      user: req.user.id, title, targetAmount, deadline
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGoals, createGoal };