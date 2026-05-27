import { createContext, useState, useEffect } from 'react';
import { ApiClient } from '../services/api'; // Import our brand new API connector bridge

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added to prevent flashing routes while reading data

  // 1. PERSISTENCE CHECK: Run this automatically every time the app launches
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      // If a session exists, parse the string data and lock it back into active React state
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // Done verifying the session state!
  }, []);

  // 2. REAL LOGIN
  const login = async (email, password) => {
    try {
      // Pass the parameters directly to our backend server through the ApiClient
      const data = await ApiClient.login(email, password);
      
      // Store the session parameters in local storage so updates survive browser refreshes
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update our global user tracking state
      setUser(data.user);
      return data.user;
    } catch (error) {
      // Bubbles errors directly up to your AuthPortal login alerts!
      throw error;
    }
  };

  // 3. REAL SIGNUP
  const signup = async (email, password) => {
    try {
      const data = await ApiClient.signup(email, password);
      
      // Automatically establish an active session using the returned token keys
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  // 4. REAL LOGOUT
  const logout = () => {
    // Completely wipe all security tokens out of the browser memory fields
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading, // Pass loading down so your pages know when authentication check is complete
        login,
        signup,
        logout,
      }}
    >
      {/* If loading is true, we briefly wait for local storage before mounting children */}
      {!loading && children}
    </AuthContext.Provider>
  );
};