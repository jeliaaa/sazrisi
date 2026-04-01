import { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useQuizStore } from "../stores/quizStore";
import Lock from "../icons/lock-solid.svg?react";
import { Category, Quiz } from "../types/types";
import Loader from "../components/reusables/Loader";

// ── Main Quizs page ───────────────────────────────────────────────────────────

const Quizs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategoryId = Number(searchParams.get("categoryId"));

  const { categories, fetchCategories, quizzes, fetchCategoryQuizzes, loading } = useQuizStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchCategoryQuizzes(selectedCategoryId);
    }
  }, [selectedCategoryId, fetchCategoryQuizzes]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white p-4 sm:p-6 rounded-2xl shadow top-4">
          <h2 className="title sm:text-xl font-bold text-dark-color mb-4 border-b pb-2">კატეგორიები</h2>
          <ul className="space-y-2">
            {categories.map((cat: Category) => (
              <li key={cat.id}>
                <button
                  onClick={() => navigate(`?categoryId=${cat.id}`)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-xl transition duration-200 font-medium text-sm sm:text-base ${
                    selectedCategoryId === cat.id
                      ? "bg-main-color text-white shadow"
                      : "bg-gray-50 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <span>{cat.title}</span>
                </button>
              </li>
            ))}
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
                  {quizzes.map((quiz: Quiz) => {
                    const isLocked = quiz.is_paid && !quiz.has_access;
                    return (
                      <Link
                        to={`/quiz/${selectedCategoryId}/${quiz.id}`}
                        key={quiz.id}
                      >
                        <div className="border w-full border-gray-200 p-4 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="title font-semibold">{quiz.title}</h4>
                            {quiz.description && (
                              <p className="plain-text text-gray-600 text-sm">{quiz.description}</p>
                            )}
                          </div>
                          {isLocked ? (
                            <span className="flex items-center gap-1.5 text-main-color shrink-0 mt-0.5">
                              <span className="text-sm font-bold">{quiz.price}₾</span>
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          ) : quiz.is_paid ? (
                            <span className="text-xs text-green-600 font-bold shrink-0 mt-0.5">✓ წვდომა</span>
                          ) : null}
                        </div>
                      </Link>
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

export default Quizs;
