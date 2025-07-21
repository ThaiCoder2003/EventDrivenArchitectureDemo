import { useState, useEffect } from 'react';
import axios from 'axios';// your axios instance

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 Add this
  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get('/user/check', { withCredentials: true });
        setIsAuthenticated(res.data.isAuthenticated);
      } catch {
        setIsAuthenticated(false);
      }
      finally {
        setLoading(false); // ✅
      }
    };
    check();
  }, []);


  const logout = async () => {
    localStorage.removeItem('token');
    // Send logout event to server if needed
    // For example, you can call an API endpoint to handle logout
    try {
      await axios.post('/user/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      console.log('Logout successful');
    }
    catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { isAuthenticated, logout, loading };
};

