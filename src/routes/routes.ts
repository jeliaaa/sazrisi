export const PublicRoutes = {
  login: "/login",
  register: "/register",
};

export const privateRoutes = {
  main: "/",
  quizs: "/quizs",
  quizStart: "/quiz/:catId/:id/",
  quizSingle: "/quiz/:catId/:category/quiz",
  leaderboard: "/leaderboard",
  settings: "/settings",
  profile: "/profile",
  videoLessons: "/videoLessons",
  chat: "/chat"
};

export const routes = {
  ...PublicRoutes,
  ...privateRoutes,
};
