import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Pre-fill the form when the user data loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    // Update local storage so the name change reflects in the Navbar
    const updatedUser = { ...user, name };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert("Profile display name updated successfully!");
    window.location.reload(); // Refresh to update the UI globally
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Manage Profile</h2>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <input 
            type="text" 
            className="mt-1 w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address (Read Only)</label>
          <input 
            type="email" 
            className="mt-1 w-full border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
            value={email} 
            disabled 
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;