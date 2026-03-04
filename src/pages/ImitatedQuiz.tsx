import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "../stores/quizStore";
import Lock from "../icons/lock-solid.svg?react";
import { Category } from "../types/types";
import Loader from "../components/reusables/Loader";
import { useImitatedStore } from "../stores/imitatedStore";
import { File } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { generateQuizCard, QuizInfo } from "../functionalComponents/generateQuizCard";
// Example locked category IDs
const lockedCategories = [2, 5];


const ImitatedQuiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategoryId = Number(searchParams.get("categoryId"));

  const { categories, fetchCategories, loading } = useQuizStore();
  const { quizzes, fetchCategoryQuizzes } = useImitatedStore();
  const { user } = useAuthStore();
  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  console.log(quizzes);

  // Fetch quizzes when categoryId changes
  useEffect(() => {
    if (selectedCategoryId) {
      fetchCategoryQuizzes(selectedCategoryId);
    }
  }, [selectedCategoryId, fetchCategoryQuizzes]);


  const handleCategoryClick = (id: number, locked: boolean) => {
    if (!locked) {
      navigate(`?categoryId=${id}`);
    }
  };
  if (loading) {
    <Loader />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white p-4 sm:p-6 rounded-2xl shadow top-4">
          <h2 className="title sm:text-xl font-bold text-dark-color mb-4 border-b pb-2">კატეგორიები</h2>
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
        <main className="flex-1 bg-white p-6 rounded-2xl shadow-lg">
          {selectedCategoryId ? (
            <div>
              <h3 className="title sm:text-2xl font-bold text-dark-color mb-6">
                ტესტები კატეგორიაში #{selectedCategoryId}
              </h3>

              {quizzes.length === 0 ? (
                <p className="plain-text text-gray-500">ტესტები ვერ მოიძებნა.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {quizzes.map((quiz) => {
                    const hasAttempt = !!quiz.attempt;
                    const isInactive = !quiz.is_active;
                    const hasInvalidSpace = !quiz.is_valid_space;

                    ;
                    const isCompleted = hasAttempt && quiz.attempt?.status === "completed";
                    const isUpcoming =
                      isInactive &&
                      quiz.start_datetime &&
                      new Date() < new Date(quiz.start_datetime);


                    const isPastDue =
                      isInactive &&
                      quiz.end_datetime &&
                      new Date() > new Date(quiz.end_datetime);

                    const isDisabled = !isInactive || hasInvalidSpace || isCompleted || isPastDue;

                    let cardStyle = "border-gray-200 bg-white hover:shadow-md cursor-pointer";
                    let label = null;
                    let hasExamPaper = false




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

                    if (isCompleted) {
                      cardStyle = "border-green-400 bg-green-50 text-green-800 hover:shadow-md";
                      label = "შედეგის ნახვა";
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
                            console.log("Generating quiz card for attempt:", quiz.attempt);

                            const quizInfo: QuizInfo = {
                              quizId: quiz.id!.toString(),
                              quizTitle: quiz.title ?? "Quiz",
                              quizDescription: quiz.description ?? "",
                              quizTimeLimit: quiz.time_limit ?? 0,
                              quizStartDate: quiz.start_datetime,
                              quizEndDate: quiz.end_datetime,
                              category: selectedCategoryId.toString() ?? "General",
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
                              {new Date(quiz.start_datetime).toLocaleString("ka-GE")} - {new Date(quiz.end_datetime).toLocaleString("ka-GE")}
                            </div>
                          )}
                          {label && (
                            <div className="mt-2 text-xs font-semibold">
                              {label}
                            </div>
                          )}
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
            </div>
          ) : (
            <span className="text-gray-500">აირჩიეთ კატეგორია მარცხნიდან</span>
          )}
        </main>
      </div>
    </div>
  );
};

export default ImitatedQuiz;
