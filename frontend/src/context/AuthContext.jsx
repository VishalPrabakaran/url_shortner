import {
  createContext,
  useState,
} from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  // Fake Login
  const login = async (email) => {

    const fakeUser = {
      name: email.split('@')[0],
      email,
      role: 'Enterprise',
    };

    setUser(fakeUser);

    return fakeUser;
  };

  // Fake Signup
  const signup = async (email) => {

    const fakeUser = {
      name: email.split('@')[0],
      email,
      role: 'Enterprise',
    };

    setUser(fakeUser);

    return fakeUser;
  };

  // Logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};