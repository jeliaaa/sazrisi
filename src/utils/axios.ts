import axios from "axios";
import Cookies from "js-cookie";

// Helper function to create Axios instance for a specific API version
const createAxiosInstance = (version : string) => {
    const instance = axios.create({
        baseURL: `${import.meta.env.VITE_BACKEND_APP_URL}/api/${version}`,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken")
        },
    });

    instance.interceptors.request.use(
        (config) => {
            const csrftoken = Cookies.get("csrftoken");
            if (csrftoken) {
                config.headers["X-CSRFToken"] = csrftoken;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return instance;
};

// Export instances for different versions
export const apiV1 = createAxiosInstance("v1");
export const apiV2 = createAxiosInstance("v2");
