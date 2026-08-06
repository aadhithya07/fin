import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ description: '', amount: '', category: 'Food' });

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const { data } = await axios.get('https://fin-shp9.onrender.com', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses", error);
      }
    };
    fetchExpenses();
  }, []);

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const { data } = await axios.post('https://fin-shp9.onrender.com', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses([data, ...expenses]);
      setFormData({ description: '', amount: '', category: 'Food' });
    } catch (error) {
      console.error("Error adding expense", error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left: Form */}
      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Description" required className="border p-2 rounded"
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input type="number" placeholder="Amount" required className="border p-2 rounded"
            value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
          <select className="border p-2 rounded" value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Housing">Housing</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Add Transaction</button>
        </form>
      </div>

      {/* Right: Table */}
      <div className="md:col-span-2 bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b"><th className="pb-2">Date</th><th className="pb-2">Description</th><th className="pb-2">Category</th><th className="pb-2">Amount</th></tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id} className="border-b">
                <td className="py-2">{new Date(exp.createdAt).toLocaleDateString()}</td>
                <td className="py-2">{exp.description}</td>
                <td className="py-2">{exp.category}</td>
                <td className="py-2 font-bold">${exp.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;