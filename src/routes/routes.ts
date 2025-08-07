export const PublicRoutes = {
  login: "/login",
  register: "/register",
};

export const privateRoutes = {
  main: "/",
  quizs: "/quizs",
  quizStart: "/quiz/:catId/:id/",
  quizSingle: "/quiz/:catId/:id/:attemptId",
  leaderboard: "/leaderboard",
  settings: "/settings",
  profile: "/profile",
  videoLessons: "/videoLessons",
  chat: "/chat",
  test: "/test"
};

export const routes = {
  ...PublicRoutes,
  ...privateRoutes,
};
