import { lazy } from 'react';
import { routes } from './routes';

const TestsPage = lazy(() => import('../pages/Tests'));
const TestsSinglePage = lazy(() => import('../pages/TestSingle'));
const LeaderboardPage = lazy(() => import('../pages/Leaderboard'));
const SettingsPage = lazy(() => import('../pages/Settings')); 

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
        component: LeaderboardPage,
    },
    {
        title: "settings",
        path: routes.settings, 
        component: SettingsPage, 
    }
];
