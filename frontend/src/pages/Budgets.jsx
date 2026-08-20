import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ category: 'Food', limit: '', period: 'Monthly' });
  const [editId, setEditId] = useState(null); // NEW: Tracks which budget we are editing

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = userData?.token || userData?.data?.token || userData?.userInfo?.token;
      if (!token) return;

      try {
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
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = userData?.token || userData?.data?.token || userData?.userInfo?.token;

    try {
      if (editId) {
        // --- CRUD: UPDATE EXISTING BUDGET ---
        const { data } = await axios.put(`https://fin-shp9.onrender.com/api/budgets/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBudgets(budgets.map((b) => (b._id === editId ? data : b)));
        setEditId(null); // Exit edit mode
      } else {
        // --- DATA VALIDATION: PREVENT DUPLICATES ---
        const categoryExists = budgets.some(b => b.category === formData.category);
        if (categoryExists) {
          alert(`You already have a budget set for ${formData.category}. Please edit the existing one instead!`);
          return;
        }

        // --- CRUD: CREATE NEW BUDGET ---
        const { data } = await axios.post('https://fin-shp9.onrender.com/api/budgets', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBudgets([data, ...budgets]);
      }
      // Reset form
      setFormData({ category: 'Food', limit: '', period: 'Monthly' });
    } catch (error) {
      console.error("Failed to save budget", error);
    }
  };

  // --- CRUD: DELETE BUDGET ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = userData?.token || userData?.data?.token || userData?.userInfo?.token;

    try {
      await axios.delete(`https://fin-shp9.onrender.com/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(budgets.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Failed to delete budget", error);
    }
  };

  // Populate the form when "Edit" is clicked
  const handleEditClick = (budget) => {
    setEditId(budget._id);
    setFormData({ category: budget.category, limit: budget.limit, period: budget.period || 'Monthly' });
  };

  const calculateSpent = (category) => {
    return expenses.filter(exp => exp.category === category).reduce((total, current) => total + current.amount, 0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="bg-white p-6 shadow-md rounded-lg h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {editId ? "Update Budget" : "Set New Budget"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select className="border p-2 rounded" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} disabled={editId !== null}>
            <option value="Food">Food</option>
            <option value="Housing">Housing</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
          </select>
          <input type="number" placeholder="Budget Limit ($)" required className="border p-2 rounded" value={formData.limit} onChange={(e) => setFormData({...formData, limit: e.target.value})} />
          <button type="submit" className={`font-bold py-2 px-4 rounded text-white ${editId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
            {editId ? "Save Changes" : "Save Budget"}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setFormData({ category: 'Food', limit: '', period: 'Monthly' }); }} className="text-gray-500 hover:text-gray-700 underline text-sm mt-2">
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Display Section with Edit/Delete Buttons */}
      <div className="md:col-span-2 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Budget Tracking & Alerts</h2>
        <div className="grid grid-cols-1 gap-6">
          {budgets.map((b) => {
            const spent = calculateSpent(b.category);
            const remaining = b.limit - spent;
            const percentage = Math.min((spent / b.limit) * 100, 100);

            return (
              <div key={b._id} className="border border-gray-200 p-4 rounded-lg bg-gray-50 relative group">
                {/* Edit & Delete Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-3">
                  <button onClick={() => handleEditClick(b)} className="text-blue-500 hover:text-blue-700 text-sm font-semibold">Edit</button>
                  <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Delete</button>
                </div>

                <div className="flex justify-between items-center mb-2 pr-20">
                  <span className="font-bold text-gray-800 text-lg">{b.category}</span>
                  <span className="font-bold text-gray-600">${spent} / ${b.limit}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div className={`h-2.5 rounded-full ${percentage >= 100 ? 'bg-red-600' : 'bg-green-500'}`} style={{ width: `${percentage}%` }}></div>
                </div>
                <p className="text-sm text-gray-500">Remaining: <span className={remaining < 0 ? "text-red-500" : "text-green-600"}>${remaining}</span></p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Budgets;