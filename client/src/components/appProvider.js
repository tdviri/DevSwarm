import React, { createContext, useState } from 'react';

const AppContext = createContext();

export default function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showLogInPage, setShowLogInPage] = useState(false);
  const [showRegisterPage, setShowRegisterPage] = useState(false);
  // Other state variables and functions you want to share

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isGuest,
        setIsGuest,
        showLogInPage,
        setShowLogInPage,
        showRegisterPage,
        setShowRegisterPage,
        // Other state variables and functions you want to share
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
