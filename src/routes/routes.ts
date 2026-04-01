export const PublicRoutes = {
  login: "/login",
  register: "/register",
};

export const privateRoutes = {
  main: "/",
  quizs: "/quizs",
  quizStart: "/quiz/:catId/:id/",
  quizSingle: "/quiz/:catId/:id/:attemptId",
  quizResult: "/quiz/result/:attemptId",
  imitatedQuiz : "/imitated",
  imitatedApply: "/imitated/:categoryId/:quizId",
  imitatedResult: "/imitated/result/:code",
  leaderboard: "/leaderboard",
  settings: "/settings",
  profile: "/profile",
  videoLessons: "/videoLessons",
  chat: "/chat",
  test: "/test",
  news: "/news",
  newsSingle: "/news/:id",
  paymentSuccess: "/payment/success",
  paymentFail: "/payment/fail",
};

export const routes = {
  ...PublicRoutes,
  ...privateRoutes,
};
