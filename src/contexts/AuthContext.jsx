import React, { createContext, useContext, useState } from "react";
import { useLocation } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  
  // Simulate being logged in when on the dashboard or chat page
  const isDashboard = location.pathname === "/dashboard";
  const isChatPage = location.pathname === "/chat" || location.pathname.startsWith("/chat/");
  const isLoggedIn = isDashboard || isChatPage;

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const value = {
    isAuthenticated: isAuthenticated || isLoggedIn,
    login,
    logout,
    isLoggedIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 