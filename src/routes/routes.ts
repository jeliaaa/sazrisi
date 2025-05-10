export const PublicRoutes = {
    index: "/",
    login: "/login",
    register: "/register",
};

export const privateRoutes = {
  tests: "/tests",
  testsSingle: "/tests/:category/:questionId",
  leaderboard: "/leaderboard",
  settings: "/settings", 
  profile: "/profile",
  videoLessons: "/videoLessons"
};


export const routes = {
    ...PublicRoutes,
    ...privateRoutes,
};
