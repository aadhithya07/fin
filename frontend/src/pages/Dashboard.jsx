import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components to prevent rendering errors
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch expenses securely on component load
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token || localStorage.getItem('token');

        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Note: Change this to your Render URL if testing production!
        const response = await axios.get('https://fin-shp9.onrender.com', config);
        
        setExpenses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Could not load dashboard data.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 2. Process data for the chart (Group totals by category)
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {});

  // 3. Configure the Chart.js visual data
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#EF4444', // Red (Food)
          '#3B82F6', // Blue (Housing)
          '#F59E0B', // Yellow (Entertainment)
          '#10B981', // Green (Transport)
          '#8B5CF6', // Purple (Utilities)
          '#6B7280', // Gray (Other)
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  // 4. Grab only the 5 most recent transactions for the list
  const recentTransactions = expenses.slice(0, 5);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Dashboard</h1>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COMPONENT: Expense Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Expense Distribution</h2>
          
          {expenses.length === 0 ? (
            <p className="text-gray-500 italic mt-10">No data to display. Add expenses!</p>
          ) : (
            <div className="w-full max-w-[300px]">
              <Doughnut data={chartData} />
            </div>
          )}
        </div>

        {/* RIGHT COMPONENT: Recent Transactions List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
          
          {recentTransactions.length === 0 ? (
            <div className="h-48 border-2 border-dashed border-gray-200 flex items-center justify-center rounded">
              <p className="text-gray-500 italic text-sm">No recent transactions found. Add some data!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentTransactions.map((expense) => (
                <li key={expense._id || Math.random()} className="py-4 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{expense.description}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {expense.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${Number(expense.amount).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;