import axios from "axios";

const axiosInstance = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

// Add Axios interceptor for handling 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    // (error) => {
    //     if (error.response && error.response.status === 401) {
    //         localStorage.removeItem("securedToken");
    //         localStorage.removeItem("user");
    //         window.location.href = "/login";
    //         window.location.reload();
    //     }
    //     return Promise.reject(error);
    // }
);

export default axiosInstance;