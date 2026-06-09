import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state for adding a new expense
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food' // Default category
  });

  // 1. FETCH EXPENSES ON LOAD
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // Grab the ID Badge (Token)
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token || localStorage.getItem('token');

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get('http://localhost:5000/api/expenses', config);
        setExpenses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch expenses:', err);
        setError('Could not load expenses. Make sure you are logged in.');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // 2. HANDLE FORM INPUT CHANGES
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. SUBMIT NEW EXPENSE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Grab the ID Badge (Token)
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token || localStorage.getItem('token');

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Send the data to the backend
      const response = await axios.post('http://localhost:5000/api/expenses', formData, config);
      
      // Add the new expense to our list instantly without refreshing the page
      setExpenses([response.data, ...expenses]);
      
      // Clear the form
      setFormData({ description: '', amount: '', category: 'Food' });
    } catch (err) {
      console.error('Failed to add expense:', err);
      setError('Failed to add expense. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Expenses</h1>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Add Expense Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                placeholder="e.g., Groceries"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              >
                <option value="Food">Food</option>
                <option value="Housing">Housing</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add Expense
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Expenses List */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Expense History</h2>
          
          {loading ? (
            <div className="text-gray-500 text-center py-8">Loading expenses...</div>
          ) : expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense._id || Math.random()}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(expense.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        ${Number(expense.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 italic bg-gray-50 rounded border border-dashed border-gray-300">
              <p>No expenses found.</p>
              <p className="text-sm">Use the form on the left to add your first transaction!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Expenses;