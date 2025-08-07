import { lazy } from "react";
import { routes } from "./routes";

const IndexPage = lazy(() => import("../pages/Main"));
const QuizPage = lazy(() => import("../pages/Quizs"));
const QuizStartPage = lazy(() => import("../pages/QuizStart"));
const QuizSinglePage = lazy(() => import("../pages/QuizSingle"));
const LeaderboardPage = lazy(() => import("../pages/Leaderboard"));
const SettingsPage = lazy(() => import("../pages/Settings"));
const ProfilePage = lazy(() => import("../pages/Profile"));
const VideoLessonsPage = lazy(() => import("../pages/VideoLessons"));
const ChatPage = lazy(() => import("../pages/Chat"));
const Test = lazy(() => import("../Test"));

export const privateRoutes = [
  {
    title: "main",
    path: routes.main,
    component: IndexPage,
  },
  {
    title: "quizs",
    path: routes.quizs,
    component: QuizPage,
  },
  {
    title: "quizStart",
    path: routes.quizStart,
    component: QuizStartPage,
  },
  {
    title: "quizSingle",
    path: routes.quizSingle,
    component: QuizSinglePage,
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
  },
  {
    title: "profile",
    path: routes.profile,
    component: ProfilePage,
  },
  {
    title: "videoLessons",
    path: routes.videoLessons,
    component: VideoLessonsPage,
  },
  {
    title: "chat",
    path: routes.chat,
    component: ChatPage,
  },
  {
    title: "test",
    path: routes.test,
    component: Test,
  }
];
