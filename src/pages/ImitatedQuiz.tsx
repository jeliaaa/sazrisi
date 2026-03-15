import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "../stores/quizStore";
import Lock from "../icons/lock-solid.svg?react";
import { Category, ImitiatedQuiz } from "../types/types";
import Loader from "../components/reusables/Loader";
import { useImitatedStore } from "../stores/imitatedStore";
import { File } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { generateQuizCard, QuizInfo } from "../functionalComponents/generateQuizCard";
import toast from "react-hot-toast";

const lockedCategories = [2, 5];
type TabType = "apply" | "results";

const ImitatedQuiz = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategoryId = Number(searchParams.get("categoryId")) || 1;
  const activeTab = (searchParams.get("tab") as TabType) ?? "apply";

  const { categories, fetchCategories, loading } = useQuizStore();
  const { quizzes, completedAttempts, fetchCategoryQuizzes, fetchCompletedAttempts } = useImitatedStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCategories();
    fetchCompletedAttempts();
  }, [fetchCategories, fetchCompletedAttempts]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchCategoryQuizzes(selectedCategoryId);
    }
  }, [selectedCategoryId, fetchCategoryQuizzes]);

  const handleCategoryClick = (id: number, locked: boolean) => {
    if (!locked) {
      setSearchParams({ categoryId: id.toString(), tab: activeTab });
    }
  };

  const handleTabChange = (tab: TabType) => {
    setSearchParams({
      ...(selectedCategoryId ? { categoryId: selectedCategoryId.toString() } : {}),
      tab,
    });
  };

  const handleGoToResult = (quiz: ImitiatedQuiz) => () => {
    if (quiz.attempt?.code && new Date() > new Date(quiz.end_datetime)){
      navigate(`/imitated/result/${quiz.attempt.code}`);
    } else{
      toast.loading("შედეგები ხელმისაწვდომი იქნება ტესტის დასრულების შემდეგ!");
      setTimeout(() => toast.dismiss(), 3000);
    }
  };

  // "Apply" tab — quizzes that are not yet completed (upcoming, active, open)
  const applyQuizzes = quizzes.filter((q) => q.attempt?.status !== "completed");

  // "Results" tab — from completedAttempts store
  const resultQuizzes = completedAttempts;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white p-4 sm:p-6 rounded-2xl shadow top-4">
          <h2 className="title sm:text-xl font-bold text-dark-color mb-4 border-b pb-2">
            კატეგორიები
          </h2>
          <ul className="space-y-2">
            {categories.map((cat: Category) => {
              const isLocked = lockedCategories.includes(cat.id);
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id, isLocked)}
                    disabled={isLocked}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-xl transition duration-200 font-medium text-sm sm:text-base ${selectedCategoryId === cat.id && !isLocked
                      ? "bg-main-color text-white shadow"
                      : isLocked
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-50 hover:bg-gray-200 text-gray-700"
                      }`}
                  >
                    <span>{cat.title}</span>
                    {isLocked && <Lock className="w-4 h-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            {(["apply", "results"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors duration-200 ${activeTab === tab
                  ? "border-b-2 border-main-color text-main-color"
                  : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                {tab === "apply" ? "რეგისტრაცია" : "შედეგები"}
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === tab ? "bg-main-color/10 text-main-color" : "bg-gray-100 text-gray-400"
                  }`}>
                  {tab === "apply" ? applyQuizzes.length : resultQuizzes.length}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Apply Tab */}
            {activeTab === "apply" && (
              <>
                {!selectedCategoryId ? (
                  <p className="text-gray-500">აირჩიეთ კატეგორია მარცხნიდან</p>
                ) : applyQuizzes.length === 0 ? (
                  <p className="plain-text text-gray-500">ტესტები ვერ მოიძებნა.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {applyQuizzes.map((quiz) => {
                      const hasAttempt = !!quiz.attempt;
                      const isInactive = !quiz.is_active;
                      const hasInvalidSpace = !quiz.is_valid_space;
                      const isUpcoming =
                        isInactive && quiz.start_datetime && new Date() < new Date(quiz.start_datetime);
                      const isPastDue =
                        isInactive && quiz.end_datetime && new Date() > new Date(quiz.end_datetime);
                      const isDisabled = !isInactive || hasInvalidSpace || isPastDue;

                      let cardStyle = "border-gray-200 bg-white hover:shadow-md cursor-pointer";
                      let label = null;
                      let hasExamPaper = false;

                      if (isUpcoming) {
                        cardStyle = "border-main-color text-dark-color cursor-pointer";
                        label = "მალე დაიწყება | დარეგისტრირდი";
                      }
                      if (isPastDue) {
                        cardStyle = "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed";
                        label = "არაქტიური";
                      }
                      if (hasInvalidSpace && !isPastDue) {
                        cardStyle = "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed";
                        label = "ადგილები შევსებულია";
                      }
                      if (!isInactive) {
                        cardStyle = "border-blue-200 bg-blue-50 text-blue-800 cursor-not-allowed";
                        label = "მიმდინარეობს";
                      }
                      if (hasAttempt && (isUpcoming || !isInactive)) {
                        hasExamPaper = true;
                        label = "რეგისტრაცია წარმატებით შესრულდა!";
                      }

                      return (
                        <div
                          key={quiz.id}
                          onClick={() => {
                            if (isDisabled) return;
                            if (hasAttempt && user) {
                              const quizInfo: QuizInfo = {
                                quizId: quiz.id!.toString(),
                                quizTitle: quiz.title ?? "Quiz",
                                quizDescription: quiz.description ?? "",
                                quizTimeLimit: quiz.time_limit ?? 0,
                                quizStartDate: quiz.start_datetime,
                                quizEndDate: quiz.end_datetime,
                                category: selectedCategoryId.toString(),
                                room: 1,
                                location: quiz.location ?? "N/A",
                                laptopMode: true,
                                code: quiz.attempt?.code ?? "N/A",
                              };
                              generateQuizCard(user, quizInfo);
                            } else {
                              navigate(`/imitated/${selectedCategoryId}/${quiz.id}`);
                            }
                          }}
                          className={`border p-4 flex justify-between rounded-xl transition ${cardStyle}`}
                        >
                          <div>
                            <h4 className="title font-semibold">{quiz.title}</h4>
                            {quiz.description && (
                              <p className="plain-text text-sm">{quiz.description}</p>
                            )}
                            {quiz.start_datetime && quiz.end_datetime && (
                              <div className="mt-2 text-xs text-gray-500">
                                {new Date(quiz.start_datetime).toLocaleString("ka-GE")} -{" "}
                                {new Date(quiz.end_datetime).toLocaleString("ka-GE")}
                              </div>
                            )}
                            {label && <div className="mt-2 text-xs font-semibold">{label}</div>}
                          </div>
                          {hasExamPaper && (
                            <div className="mt-2 text-xs text-dark-color flex flex-col items-end font-medium">
                              <span>გამოცდის ქაღალდი ხელმისაწვდომია</span>
                              <File className="w-10 h-10 mt-1" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Results Tab */}
            {activeTab === "results" && (
              <>
                {resultQuizzes.length === 0 ? (
                  <p className="plain-text text-gray-500">შედეგები ვერ მოიძებნა.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {resultQuizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        onClick={handleGoToResult(quiz)}
                        className="border border-green-300 bg-green-50 p-4 rounded-xl cursor-pointer hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="title font-semibold text-green-900">{quiz.title}</h4>
                            {quiz.description && (
                              <p className="plain-text text-sm text-green-700">{quiz.description}</p>
                            )}
                            <div className="mt-2 text-xs text-gray-500">
                              {new Date(quiz.start_datetime).toLocaleString("ka-GE")} -{" "}
                              {new Date(quiz.end_datetime).toLocaleString("ka-GE")}
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            <div className="text-2xl font-bold text-green-700">
                              {quiz.attempt.correct_answers}
                              <span className="text-sm font-normal text-green-500">
                                /{quiz.total_score}
                              </span>
                            </div>
                            <div className="text-xs text-green-600 mt-0.5">
                              {Math.round((quiz.attempt.correct_answers / quiz.total_score) * 100)}%
                            </div>
                            <div className="mt-2 text-xs font-semibold text-green-800">
                              შედეგის ნახვა →
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImitatedQuiz;