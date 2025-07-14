import { createContext, useState, useContext, useEffect } from "react";
import { verifyToken } from "../api/apiHelper";
import { jwtDecode } from "jwt-decode";
import { getCompanyIdFromUser } from "../utils";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (credential, decodedUser) => {
    try {
      // console.log("LOGIN CALLED", credential);
      // Decode the Google JWT token
      const decoded = jwtDecode(credential);
      // Extract first and last name (Google tokens use 'given_name' and 'family_name')
      // const firstName = decoded.given_name || "";
      // const lastName = decoded.family_name || "";
      // const firstInitial = firstName ? firstName[0].toUpperCase() : "";
      // const lastInitial = lastName ? lastName[0].toUpperCase() : "";
      // const initials = `${firstInitial}${lastInitial}` || (firstInitial || "");

      // --- Custom backend token logic ---
      const response = await verifyToken(credential);
      if (response.status === 200) {
        const token = response.data.data.token;
        const userDetail = response.data.data;

        // Compute initials
        const firstName = userDetail.first_name || userDetail.firstName || userDetail.name || "";
        const lastName = userDetail.last_name || userDetail.lastName || "";
        const firstInitial = firstName ? firstName[0].toUpperCase() : "";
        const lastInitial = lastName ? lastName[0].toUpperCase() : "";
        const initials = `${firstInitial}${lastInitial}` || (firstInitial || "");

        // Add initials to userDetail
        const userDetailWithInitials = { ...userDetail, initials };

        localStorage.setItem("securedToken", token);
        localStorage.setItem("userDetail", JSON.stringify(userDetailWithInitials));
        setUser(userDetailWithInitials); // Set user to userDetail with initials
        getCompanyIdFromUser(userDetailWithInitials); // Set company_id in localStorage
      }

      // --- Google Auth only ---
      // const firstInitial = firstName ? firstName[0].toUpperCase() : "";
      // const lastInitial = lastName ? lastName[0].toUpperCase() : "";
      // const initials = `${firstInitial}${lastInitial}`;
      // const updatedUser = { ...decodedUser, googleToken: credential, firstName, lastName, initials };
      // setUser(updatedUser);
      // localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userDetail");
    localStorage.removeItem("securedToken");
    localStorage.removeItem('tenderReport');
    localStorage.removeItem('company_id');
    localStorage.removeItem('tenderId');
    localStorage.removeItem('tenderTitle');
    localStorage.removeItem('tenderList');
  };

  useEffect(() => {

    const storedUserDetail = localStorage.getItem("userDetail");
    const token = localStorage.getItem("securedToken");

    if (token) {

      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000; // in seconds
        if (decoded.exp && decoded.exp < now) {

          // Token expired
          logout();
          setAuthLoading(false);
          return;
        }
      } catch (e) {
        // Invalid token, clear everything
        logout();
        setAuthLoading(false);
        return;
      }
    }

    if (storedUserDetail) {
      setUser(JSON.parse(storedUserDetail));
    }
    setAuthLoading(false);
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
