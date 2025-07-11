import axios from "axios";

const axiosInstance = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

// Add Axios interceptor for handling 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // console.log("ERROOOOR:", error.response.data.detail)
        if (
            error.response.status === 401 &&
            error.response.data.detail === "JWT token has  Expired"
        ) {
            localStorage.removeItem("securedToken");
            localStorage.removeItem("userDetail");
            localStorage.removeItem('tenderReport');
            localStorage.removeItem('company_id');
            localStorage.removeItem('tenderTitle');
            localStorage.removeItem('tenderId');
            localStorage.removeItem('tenderList');

            window.location.href = "/signin";
            window.location.reload();
        }
        return Promise.reject(error);
    }

);

export default axiosInstance;