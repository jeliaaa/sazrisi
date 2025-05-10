export const PublicRoutes = {
  login: "/login",
  register: "/register",
};

export const privateRoutes = {
  main: "/",
  tests: "/tests",
  testsSingle: "/tests/:category/:questionId",
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
