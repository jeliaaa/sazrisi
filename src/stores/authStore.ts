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
    phone: string;
    phone_verified: boolean;
    avatar: Avatar | null;
    preferences: Preferences | null;
}

export interface Avatar {
    url: string;
}

interface Preferences {
    theme_color: string;
}

interface RegisterStep1Data {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
    rePassword: string;
    verification_code: string;

}



// ---------- Auth State ----------
interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuth: boolean;

    // Auth
    login: (login_id: string, password: string) => Promise<boolean>;
    verifyCode: (phone: string) => Promise<{ detail: string, isOk: boolean }>;
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
    resetPassword: (params: { currentPassword: string; newPassword: string }) =>
        Promise<{ success: boolean; message?: string }>;
    update: (params: { email?: string | null; theme_color?: string }) => Promise<void>;

    // Password Reset
    sendResetCode: (phone: string) => Promise<{ detail: string, isOk: boolean }>;
    confirmResetPassword: (data: { phone: string, verification_code: string, new_password: string, rePassword: string }) => Promise<boolean>;

    // Register
    registerBasic: (data: RegisterStep1Data) => Promise<boolean>;
    setPreference: (data: Preferences) => Promise<boolean>;
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
            login: async (login_id, password) => {
                try {
                    set({ loading: true, error: null });
                    await apiV1.post('/user/login/', { login_id, password });
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

            verifyCode: async (phone: string): Promise<{ detail: string, isOk: boolean }> => {
                try {
                    set({ loading: true, error: null });
                    const res = await apiV1.post<{ detail: string, isOk: boolean }>('/user/register/send-code/', { phone: `995${phone}` });
                    set({ loading: false });
                    return { detail: res.data.detail, isOk: true };
                } catch (error) {
                    const err = error as AxiosError<{ detail: string, isOk: boolean }>;
                    set({ error: err.response?.data?.detail || 'Failed to send verification code', loading: false });
                    return err.response?.data || { detail: 'დაფიქსირდა შეცდომა', isOk: false };
                }
            },

            logout: async () => {
                try {
                    set({ loading: true });
                    await apiV1.post('/user/logout/');
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

                    await apiV1.post('/user/change-password/', {
                        prev_password: currentPassword,
                        new_password: newPassword,
                    });

                    set({ loading: false, error: null });
                    return { success: true };
                } catch (error) {
                    const err = error as AxiosError<{
                        detail?: {
                            new_password?: string[];
                            prev_password?: string[];
                        }
                    }>;

                    // combine all messages from backend into one string
                    const messages: string[] = [];
                    if (err.response?.data?.detail?.prev_password) {
                        messages.push(...err.response.data.detail.prev_password);
                    }
                    if (err.response?.data?.detail?.new_password) {
                        messages.push(...err.response.data.detail.new_password);
                    }

                    const message = messages.join(" | ") || 'დაფიქსირდა შეცდომა';

                    set({ error: message, loading: false });

                    return { success: false, message };
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

            // ---------- Password Reset ----------
            sendResetCode: async (phone: string): Promise<{ detail: string, isOk: boolean }> => {
                try {
                    set({ loading: true, error: null });
                    const res = await apiV1.post<{ detail: string, isOk: boolean }>('/user/password-reset/send-code/', { phone: `995${phone}` });
                    set({ loading: false });
                    return { detail: res.data.detail, isOk: true };
                } catch (error) {
                    const err = error as AxiosError<{ detail: string, isOk: boolean }>;
                    set({ error: err.response?.data?.detail || 'Failed to send reset code', loading: false });
                    return err.response?.data || { detail: 'დაფიქსირდა შეცდომა', isOk: false };
                }
            },

            confirmResetPassword: async (data: { phone: string, verification_code: string, new_password: string, rePassword: string }) => {
                try {
                    set({ loading: true, error: null });
                    await apiV1.post('/user/password-reset/confirm/', { ...data, phone: `995${data.phone}` });
                    set({ loading: false });
                    return true;
                } catch (error) {
                    const err = error as AxiosError<{ detail?: string }>;
                    set({ error: err.response?.data?.detail || 'Password reset failed' });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            // ---------- Register ----------
            registerBasic: async (data: RegisterStep1Data) => {
                try {
                    set({ loading: true, error: null });
                    const res = await apiV1.post<User>('/user/register/', data);
                    set({ user: res.data, isAuth: true, error: null });
                    await get().fetchMe();
                    return true;
                } catch (error) {
                    const err = error as AxiosError<{ email: string }>
                    set({ error: err.response?.data?.email[0] || 'Registration failed' });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            setPreference: async (data: Preferences) => {
                try {
                    set({ loading: true, error: null });
                    const res = await apiV1.post('/user/preferences/', data);
                    set((state) => {
                        if (!state.user) return state; // or handle however you prefer
                        return {
                            user: {
                                ...state.user,
                                preferences: res.data,
                            }
                        };
                    });

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
                    formData.append('image', file);
                    const res = await apiV1.post('/user/avatar/', formData);
                    set((state) => {
                        if (!state.user) return state; // or handle however you prefer
                        return {
                            user: {
                                ...state.user,
                                avatar: res.data,
                            }
                        };
                    });
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
