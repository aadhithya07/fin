import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ category: 'Food', limit: '', period: 'Monthly' });

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      try {
        // Fetch both Budgets and Expenses to calculate real-time usage
        const budgetRes = await axios.get('https://fin-shp9.onrender.com/api/budgets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const expenseRes = await axios.get('https://fin-shp9.onrender.com/api/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setBudgets(Array.isArray(budgetRes.data) ? budgetRes.data : []);
        setExpenses(Array.isArray(expenseRes.data) ? expenseRes.data : []);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const { data } = await axios.post('https://fin-shp9.onrender.com/api/budgets', formData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setBudgets([data, ...budgets]);
      setFormData({ category: 'Food', limit: '', period: 'Monthly' });
    } catch (error) {
      console.error("Failed to save budget", error);
    }
  };

  // Helper function to calculate how much was spent per category
  const calculateSpent = (category) => {
    return expenses
      .filter(exp => exp.category === category)
      .reduce((total, current) => total + current.amount, 0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="bg-white p-6 shadow-md rounded-lg h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Set New Budget</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select className="border p-2 rounded" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option value="Food">Food</option>
            <option value="Housing">Housing</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
          </select>
          <input type="number" placeholder="Budget Limit ($)" required className="border p-2 rounded" value={formData.limit} onChange={(e) => setFormData({...formData, limit: e.target.value})} />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Save Budget
          </button>
        </form>
      </div>

      {/* Real-time Display & Alerts Section */}
      <div className="md:col-span-2 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Budget Tracking & Alerts</h2>
        <div className="grid grid-cols-1 gap-6">
          {budgets.map((b) => {
            const spent = calculateSpent(b.category);
            const remaining = b.limit - spent;
            const percentage = Math.min((spent / b.limit) * 100, 100);
            const isNearLimit = percentage >= 90;
            const isOverBudget = percentage >= 100;

            return (
              <div key={b._id} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800 text-lg">{b.category}</span>
                  <span className="font-bold text-gray-600">${spent} / ${b.limit}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-600' : isNearLimit ? 'bg-yellow-400' : 'bg-green-500'}`} style={{ width: `${percentage}%` }}></div>
                </div>
                
                <p className="text-sm text-gray-500">Remaining: <span className={remaining < 0 ? "text-red-500 font-bold" : "text-green-600 font-bold"}>${remaining}</span></p>

                {/* PRD Requirement: Alerts */}
                {isOverBudget && (
                  <div className="mt-3 p-2 bg-red-100 text-red-700 text-sm font-semibold rounded border border-red-300">
                    🚨 ALERT: You have exceeded your {b.category} budget!
                  </div>
                )}
                {isNearLimit && !isOverBudget && (
                  <div className="mt-3 p-2 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded border border-yellow-300">
                    ⚠️ WARNING: You have used {percentage.toFixed(0)}% of your {b.category} budget.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Budgets;