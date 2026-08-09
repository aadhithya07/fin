import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        // Fetching your expenses data to act as the transaction ledger
        // REPLACE WITH YOUR LIVE RENDER URL
        const { data } = await axios.get('https://fin-shp9.onrender.com', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Sort newest first
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTransactions(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions", error);
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500 font-medium">Loading ledger...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Transaction Ledger</h2>
        
        {transactions.length === 0 ? (
          <p className="text-gray-500 italic">No transactions found in the database.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-600 bg-gray-50">
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Description</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-medium text-gray-800">{t.description}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-red-600 text-right">
                      -${Number(t.amount).toFixed(2)}
                    </td>
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

export default Transactions;