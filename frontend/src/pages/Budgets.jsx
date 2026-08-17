import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({ category: 'Food', limit: '', period: 'Monthly' });

  useEffect(() => {
    const fetchBudgets = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      try {
        const { data } = await axios.get('https://fin-shp9.onrender.com/api/budgets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBudgets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch budgets", error);
      }
    };
    fetchBudgets();
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="bg-white p-6 shadow-md rounded-lg h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Set New Budget</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select 
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Food">Food</option>
            <option value="Housing">Housing</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
          </select>
          <input 
            type="number" 
            placeholder="Budget Limit ($)" 
            required 
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            value={formData.limit} 
            onChange={(e) => setFormData({...formData, limit: e.target.value})} 
          />
          <select 
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            value={formData.period}
            onChange={(e) => setFormData({...formData, period: e.target.value})}
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Save Budget
          </button>
        </form>
      </div>

      {/* Display Section */}
      <div className="md:col-span-2 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Active Budgets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {budgets.map((b) => (
            <div key={b._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center bg-gray-50">
              <div>
                <p className="font-bold text-gray-800">{b.category}</p>
                <p className="text-sm text-gray-500">{b.period}</p>
              </div>
              <p className="font-bold text-green-600 text-lg">${b.limit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Budgets;