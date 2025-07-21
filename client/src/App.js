import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/authService';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  };
  // If the user is not authenticated and tries to access a protected route, redirect to login
  return (
    <div className="min-h-screen">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={ <Homepage /> } />
        <Route
          path="/cart"
          element={isAuthenticated ? <Cart /> : <Navigate to="/login" replace />}
        />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster />
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
