// src/components/Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/authService';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="p-4 bg-gray-100 border-b flex justify-center items-center">
      <div className="flex justify-between items-center w-full max-w-4xl">
        <div className="space-x-4">
          <Link to="/">🏠 Home</Link>
          <Link to="/cart">🛒 Cart</Link>
        </div>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="text-red-600 hover:underline">
            🔓 Logout
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline"
            >
              🔑 Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-green-600 hover:underline"
            >
              📝 Register
            </button>
          </div>
        )}
      </div>
    </div>
  )
};

export default Navbar;
