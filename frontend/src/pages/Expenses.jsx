import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ description: '', amount: '', category: 'Food' });

  // 1. Fetch expenses from the backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // The Bulletproof Token Finder for page reloads
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = userData?.token || userData?.data?.token || userData?.userInfo?.token;
        
        if (!token) {
          console.error("No token found on reload!");
          return;
        }
        
        // FIXED: Removed formData from the GET request. It only takes URL and headers!
        const { data } = await axios.get('https://fin-shp9.onrender.com/api/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Fetched expenses:", data);
        // Safety check to ensure we always set an array
        setExpenses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching expenses", error);
      }
    };
    fetchExpenses();
  }, []);

  // 2. Handle adding a new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Grab the raw user data
    const userData = JSON.parse(localStorage.getItem('user'));

    // 2. The Bulletproof Token Finder
    const token = userData?.token || userData?.data?.token || userData?.userInfo?.token;

    // 3. Safety Check
    if (!token) {
      console.error("CRITICAL: Token is completely missing from Local Storage!");
      alert("Authentication error: Please log out and log back in.");
      return;
    }

    try {
      const { data } = await axios.post('https://fin-shp9.onrender.com/api/expenses', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the screen immediately
      setExpenses([data, ...expenses]); 
      setFormData({ description: '', amount: '', category: 'Food' });

    } catch (error) {
      console.error("Error adding expense", error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: The Form */}
      <div className="bg-white p-6 shadow-md rounded-lg h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Expense</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Description (e.g., Groceries)" 
            required 
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />
          <input 
            type="number" 
            placeholder="Amount" 
            required 
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.amount} 
            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
          />
          <select 
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Housing">Housing</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
            Add Transaction
          </button>
        </form>
      </div>

      {/* Right Column: The Data Table */}
      <div className="md:col-span-2 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Transaction History</h2>
        
        {expenses.length === 0 ? (
          <p className="text-gray-500 italic">No expenses recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-600">
                  <th className="pb-3 px-2 font-semibold">Date</th>
                  <th className="pb-3 px-2 font-semibold">Description</th>
                  <th className="pb-3 px-2 font-semibold">Category</th>
                  <th className="pb-3 px-2 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses?.map((exp) => (
                  <tr key={exp._id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                    <td className="py-3 px-2 text-sm text-gray-500">
                      {new Date(exp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 font-medium text-gray-800">{exp.description}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-bold text-gray-900 text-right">${Number(exp.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;