import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAuth = localStorage.getItem("isAuthenticated");

    if (savedUser && savedAuth) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(JSON.parse(savedAuth));
    }
  }, []);

  const isDashboard = location.pathname === "/dashboard";
  const isChatPage =
    location.pathname === "/chat" || location.pathname.startsWith("/chat/");
  const isLoggedIn = isDashboard || isChatPage || isAuthenticated;

  const loginWithGoogle = (credentialResponse) => {
    const credential = credentialResponse.credential;
    const decodedUser = jwtDecode(credential);

    const userInfo = {
      name: decodedUser.name,
      email: decodedUser.email,
      picture: decodedUser.picture,
      initials:
        decodedUser.given_name[0] + (decodedUser.family_name?.[0] || ""),
    };

    setUser(userInfo);
    setIsAuthenticated(true);

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("isAuthenticated", JSON.stringify(true));
  };

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", JSON.stringify(true));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  };

  const value = {
    isAuthenticated: isAuthenticated || isLoggedIn,
    user,
    login,
    loginWithGoogle,
    logout,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
