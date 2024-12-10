import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const UserContext = createContext();

// Custom hook to access the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [sessionExpiration, setSessionExpiration] = useState(null);

  // Initialize session from localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    const savedExpiration = localStorage.getItem('sessionExpiration');

    if (savedUserData && savedExpiration) {
      const parsedExpiration = Number(savedExpiration);

      if (Date.now() < parsedExpiration) {
        setUserData(JSON.parse(savedUserData));
        setSessionExpiration(parsedExpiration);
      } else {
        // Clear expired session
        localStorage.removeItem('userData');
        localStorage.removeItem('sessionExpiration');
      }
    }
  }, []);

  // Persist session to localStorage when userData or sessionExpiration changes
  useEffect(() => {
    if (userData && sessionExpiration) {
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('sessionExpiration', sessionExpiration.toString());
    } else {
      localStorage.removeItem('userData');
      localStorage.removeItem('sessionExpiration');
    }
  }, [userData, sessionExpiration]);

  // Set user data and start a new session
  const login = (user) => {
    const expirationTime = Date.now() + 2 * 60 * 60 * 1000; // 2 hours session expiration
    setUserData(user);
    setSessionExpiration(expirationTime);
  };
  

  // Clear session
  const logout = () => {
    setUserData(null);
    setSessionExpiration(null);
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
