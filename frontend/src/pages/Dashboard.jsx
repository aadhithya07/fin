import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registering outside the component
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);

  const chartData = {
    labels: ['Housing', 'Food', 'Transport', 'Entertainment'],
    datasets: [
      {
        label: 'Expenses',
        data: [1200, 400, 200, 150],
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Distribution</h2>
          <div className="relative h-72 w-full flex items-center justify-center">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
          {recentTransactions?.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentTransactions.map((t, i) => (
                <li key={i} className="py-3 flex justify-between">
                  <span className="text-gray-600">{t.description}</span>
                  <span className="font-semibold text-gray-900">${t.amount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 italic bg-gray-50 rounded border border-dashed border-gray-300">
              No recent transactions found. Add some data!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;