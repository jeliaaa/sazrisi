import { create } from "zustand";
import { AxiosError } from "axios";
import { User } from "../types/types";
import { apiV1 } from "../utils/axios";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuth: boolean;
    registerBasic: (data: RegisterStep1Data) => Promise<boolean>;
    setPreference: (data: RegisterStep2Data) => Promise<boolean>;
    uploadAvatar: (file: File) => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    getCurrentUser: () => Promise<void>;
}

interface RegisterStep1Data {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    rePassword: string;
}

interface RegisterStep2Data {
    preferences: string;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuth:false,
    user:null,
    loading: false,
    error: null,

    registerBasic: async (data) => {
        try {
            set({ loading: true, error: null });
            const res = await apiV1.post("/user/register/", data);
            set({ user: res.data });
            return true;
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            set({ error: err.response?.data?.message || "Registration failed" });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    setPreference: async (data) => {
        try {
            set({ loading: true, error: null });
            await apiV1.post("/user/preference/", data);
            return true;
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            set({ error: err.response?.data?.message || "Preference update failed" });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    uploadAvatar: async (file) => {
        try {
            set({ loading: true, error: null });
            const formData = new FormData();
            formData.append("avatar", file);
            await apiV1.post("/user/avatar/", formData);
            return true;
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            set({ error: err.response?.data?.message || "Avatar upload failed" });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    login: async (email, password) => {
        try {
            set({ loading: true, error: null });
            const res = await apiV1.post("/user/login/", { email, password });
            // Cookies.set('session_token', res.data.session_token)
            set({ user: res.data, isAuth:true });
            return true;
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            set({ error: err.response?.data?.message || "Login failed" });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    logout: () => { 
        set({ user: null });
    },

    getCurrentUser: async () => {
        try {
            set({ loading: true });
            const res = await apiV1.get("/user/profile/");
            console.log(res.data);
            set({ user: res.data, isAuth:true });
        } catch {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },
}));
