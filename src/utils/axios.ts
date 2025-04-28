import axios from "axios";
import Cookies from "js-cookie";

// Factory function to create Axios instances for different versions
const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_APP_URL}/api`, // Include version dynamically
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get('csrftoken')
    },
});

instance.interceptors.request.use(
    (config) => {
        // Add CSRF token to headers if available
        const csrftoken = Cookies.get("csrftoken");
        if (csrftoken) {
            config.headers["X-CSRFToken"] = csrftoken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;