import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiV1 } from '../utils/axios';
import { AxiosError } from 'axios';

// ---------- Types ----------
export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    email_verified: boolean;
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

// ---------- Auth State ----------
interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuth: boolean;

    // Auth
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
    resetPassword: (params: { currentPassword: string; newPassword: string }) => Promise<void>;
    update: (params: { email?: string | null; theme_color?: string }) => Promise<void>;

    // Register
    registerBasic: (data: RegisterStep1Data) => Promise<boolean>;
    setPreference: (data: RegisterStep2Data) => Promise<boolean>;
    uploadAvatar: (file: File) => Promise<boolean>;
}

// ---------- Store ----------
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            loading: false,
            error: null,
            isAuth: false,

            // ---------- Auth ----------
            login: async (email, password) => {
                try {
                    set({ loading: true, error: null });
                    await apiV1.post('/user/login/', { email, password });
                    await get().fetchMe();
                    set({ isAuth: true });
                    return true;
                } catch (error) {
                    const err = error as AxiosError<{ detail?: string }>
                    set({ error: err.response?.data?.detail || 'Login failed', isAuth: false });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                try {
                    set({ loading: true });
                    await apiV1.post('/user/logout');
                } catch (error) {
                    const err = error as AxiosError<{ detail?: string }>
                    console.warn('Logout request failed' + err);
                } finally {
                    set({ user: null, isAuth: false, loading: false, error: null });
                }
            },

            fetchMe: async () => {
                try {
                    set({ loading: true, error: null });
                    const res = await apiV1.get<User>('/user/profile');
                    set({ user: res.data, isAuth: true });
                } catch (error) {
                    const err = error as AxiosError<{ detail?: string }>
                    set({ error: err.response?.data?.detail || 'Failed to fetch user', isAuth: false });
                } finally {
                    set({ loading: false });
                }
            },

            resetPassword: async ({ currentPassword, newPassword }) => {
                try {
                    set({ loading: true, error: null });
                    await apiV1.post('/user/change-password', {
                        prev_password: currentPassword,
                        new_password: newPassword,
                    });
                } catch (error) {
                    const err = error as AxiosError<{ detail?: string }>
                    set({ error: err.response?.data?.detail || 'Something went wrong' });
                } finally {
                    set({ loading: false });
                }
            },

            update: async ({ email, theme_color }) => {
                try {
                    set({ loading: true, error: null });
                    const res = await apiV1.post<User>('/user/update', { email, theme_color });
                    set({ user: res.data });
                } catch (error) {
                    const err = error as AxiosError<{ detail?: string }>
                    set({ error: err.response?.data?.detail || 'Update failed' });
                } finally {
                    set({ loading: false });
                }
            },

            // ---------- Register ----------
            registerBasic: async (data: RegisterStep1Data) => {
                try {
                    set({ loading: true, error: null });
                    const res = await apiV1.post<User>('/user/register/', data);
                    set({ user: res.data });
                    return true;
                } catch (error) {
                    const err = error as AxiosError<{ detail?: string }>
                    set({ error: err.response?.data?.detail || 'Registration failed' });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            setPreference: async (data: RegisterStep2Data) => {
                try {
                    set({ loading: true, error: null });
                    await apiV1.post('/user/preference/', data);
                    return true;
                } catch (error) {
                    const err = error as AxiosError<{ detail?: string }>
                    set({ error: err.response?.data?.detail || 'Preference update failed' });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            uploadAvatar: async (file: File) => {
                try {
                    set({ loading: true, error: null });
                    const formData = new FormData();
                    formData.append('avatar', file);
                    await apiV1.post('/user/avatar/', formData);
                    return true;
                } catch (error) {
                    const err = error as AxiosError<{ detail?: string }>
                    set({ error: err.response?.data?.detail || 'Avatar upload failed' });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ isAuth: state.isAuth }),
        }
    )
);
