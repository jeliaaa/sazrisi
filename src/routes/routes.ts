export const PublicRoutes = {
  login: "/login",
  register: "/register",
};

export const privateRoutes = {
  main: "/",
  tests: "/tests",
  testsStart: "/tests/:category/",
  testSingle: "/tests/:category/test",
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
