import express from 'express';
import { getBudgets, createBudget } from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Apply the 'protect' middleware so only logged-in users can access these routes
router.route('/')
  .get(protect, getBudgets)
  .post(protect, createBudget);

export default router;