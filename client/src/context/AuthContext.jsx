// client/src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react'; 
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Lazy Initialization: Reads from storage immediately
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading] = useState(false);

  // --- NEW HELPER FUNCTION ---
  // This updates BOTH the React State and LocalStorage
  const updateUser = (newData) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...newData };
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Sync storage
      return updatedUser;
    });
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      updateUser, // <--- EXPORT THIS
      login, 
      register, 
      logout, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};