const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ACTIVE ROUTES (These must be perfectly exported in their respective files)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

// PENDING ROUTES (Keep these commented out until the files are actually built!)
// app.use('/api/budgets', require('./routes/budgetRoutes')); 
// app.use('/api/income', require('./routes/incomeRoutes')); 
// app.use('/api/goals', require('./routes/goalRoutes'));

app.get('/', (req, res) => {
  res.send('Personal Finance Manager API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});