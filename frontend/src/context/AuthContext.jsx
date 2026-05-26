import { createContext, useContext, useState, useEffect } from 'react';
import { ApiClient } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedSession = localStorage.getItem('shortx_session_user');
        if (storedSession) {
          const { user: storedUser, token: storedToken } = JSON.parse(storedSession);
          setUser(storedUser);
          setToken(storedToken);
        }
      } catch (err) {
        console.error('Failed to restore authentication session:', err);
        localStorage.removeItem('shortx_session_user');
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await ApiClient.login(email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('shortx_session_user', JSON.stringify(data));
    return data.user;
  };

  const signup = async (email, password) => {
    const data = await ApiClient.signup(email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('shortx_session_user', JSON.stringify(data));
    return data.user;
  };

  const logout = async () => {
    try {
      await ApiClient.logout();
    } catch (err) {
      console.error('Error during API logout cleanup:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('shortx_session_user');
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed inside an AuthProvider wrapper.');
  }
  return context;
};

