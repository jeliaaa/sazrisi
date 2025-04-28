// src/routes/publicRoutes.tsx
import { lazy } from 'react';
import { routes } from './routes';

// Lazy load your page
const LoginPage = lazy(() => import('../pages/auth/Login'));
const RegisterPage = lazy(() => import('../pages/auth/Register'));

export const publicRoutes = [
    {
        title: "Login",
        path: routes.login,
        component: LoginPage,
    },
    {
        title: "Register",
        path: routes.register,
        component: RegisterPage,
    },

];
