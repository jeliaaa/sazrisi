export const PublicRoutes = {
    index: "/",
    login: "/login",
    register: "/register",
};

export const privateRoutes = {
    tests: "/tests",
    testsSingle: "/tests/:category/:questionId",
    leaderboard: "/leaderboard",
};


export const routes = {
    ...PublicRoutes,
    ...privateRoutes,
};