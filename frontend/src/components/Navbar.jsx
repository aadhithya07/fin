import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold tracking-wider">
            FinanceManager
          </Link>
          
          <div className="flex space-x-4 items-center">
            {user ? (
              <>
                <Link to="/" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/expenses" className="hover:text-blue-200">Expenses</Link>
                <Link to="/transactions" className="hover:text-blue-200">Transactions</Link>
                <span className="ml-4 font-semibold text-blue-100">Hi, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;