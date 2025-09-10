import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Prevent multiple concurrent redirects
let isLoggingOut = false;

// Add Axios interceptor for handling 401 errors robustly
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Defensive: check error.response exists
    const detail = error?.response?.data?.detail;
    if (
      error?.response?.status === 401 &&
      typeof detail === "string" &&
      detail.toLowerCase().includes("expired")
    ) {
      if (isLoggingOut) return Promise.reject(error);
      isLoggingOut = true;
      // Remove all possible auth/session keys
      const keysToRemove = [
        "securedToken",
        "userDetail",
        "TENDER_REPORT",
        "company_id",
        "TENDER_TITLE",
        "TENDER_ID",
        "tenderList",
        // Add any other keys used for auth/session here
      ];
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      // Remove in-memory Authorization header
      if (
        axios.defaults &&
        axios.defaults.headers &&
        axios.defaults.headers.common
      ) {
        delete axios.defaults.headers.common["Authorization"];
      }
      if (
        axiosInstance.defaults &&
        axiosInstance.defaults.headers &&
        axiosInstance.defaults.headers.common
      ) {
        delete axiosInstance.defaults.headers.common["Authorization"];
      }
      // Redirect to signin page (no reload)
      window.location.replace("/signin");
      return; // Do not continue
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
