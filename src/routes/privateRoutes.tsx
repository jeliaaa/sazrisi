// src/routes/publicRoutes.tsx
import { lazy } from 'react';
import { routes } from './routes';
const TestsPage = lazy(() => import('../pages/Tests'));
const TestsSinglePage = lazy(() => import('../pages/TestSingle'));
const LeaderboardPage = lazy(() => import('../pages/Leaderboard'));


// Lazy load your page


export const privateRoutes = [
    {
        title: "tests",
        path: routes.tests,
        component: TestsPage,
    },
    {
        title: "testsSingle",
        path: routes.testsSingle,
        component: TestsSinglePage,
    },
    {
        title: "leaderboard",
        path: routes.leaderboard,
        component: LeaderboardPage
    }
];
