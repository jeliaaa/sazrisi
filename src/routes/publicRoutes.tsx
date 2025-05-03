// src/routes/publicRoutes.tsx
import { lazy } from 'react';
import { routes } from './routes';

// Lazy load your page
const LoginPage = lazy(() => import('../pages/auth/Login'));
const RegisterPage = lazy(() => import('../pages/auth/SignUp'));

export const publicRoutes = [
    {
        title: "login",
        path: routes.login,
        component: LoginPage,
    },
    {
        title: "register",
        path: routes.register,
        component: RegisterPage,
    },
];
