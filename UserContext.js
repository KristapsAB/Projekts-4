import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserDataState] = useState({
    userId: null,
    username: null,
    role: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeContext = async () => {
      try {
        // Check local storage for user data
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');
        const storedUserRole = localStorage.getItem('role');
  
        // Update context based on local storage
        if (storedUserId && storedUsername && storedUserRole) {
          setUserDataState({
            userId: storedUserId,
            username: storedUsername,
            role: storedUserRole,
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error accessing local storage:', error);
        // Handle the error (e.g., reset local storage, show an error message)
      } finally {
        // Set loading to false once the context is updated or an error occurs
        setLoading(false);
      }
    };
  
    // Call the asynchronous initialization function
    initializeContext();
  }, [setIsAuthenticated, setUserDataState]);
  

  const setAuthStatus = (status) => {
    setIsAuthenticated(status);
  };

  const setUserData = (data) => {
    // Update state and local storage when user data changes
    setUserDataState(data);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
  };

  // Include setUserData and logout in the context value
  const contextValue = {
    isAuthenticated,
    setAuthStatus,  
    userData,
    setUserData,   
    logout: () => {
      setIsAuthenticated(false);
      setUserDataState({
        userId: null,
        username: null,
        role: null,
      });
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    },
    checkAuthStatus: () => {
      const token = localStorage.getItem('token');
      return token !== null;
    },
  };

  return (
    <UserContext.Provider value={contextValue}>
      {!loading ? children : <p>Loading...</p>}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
