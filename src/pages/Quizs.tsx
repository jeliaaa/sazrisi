import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "../stores/quizStore";
import Lock from "../icons/lock-solid.svg?react";
import { Category } from "../types/types";
import { apiV2 } from "../utils/axios";

// Example locked category IDs
const lockedCategories = [2, 5];

interface Quiz {
  id: number;
  title: string;
  description?: string;
  // Add more fields if your backend returns them
}

const Quizs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategoryId = Number(searchParams.get("categoryId"));

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const { categories, fetchCategories } = useQuizStore();

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch quizzes when categoryId changes
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!selectedCategoryId) return;
      try {
        const res = await apiV2.get(`/quiz/category/${selectedCategoryId}/quizzes/0/`);
        setQuizzes(res.data);
        console.log("Fetched quizzes:", res.data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };

    fetchQuizzes();
  }, [selectedCategoryId]);

  const handleCategoryClick = (id: number, locked: boolean) => {
    if (!locked) {
      navigate(`?categoryId=${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white p-4 sm:p-6 rounded-2xl shadow top-4">
          <h2 className="text-lg sm:text-xl font-bold text-dark-color mb-4 border-b pb-2">კატეგორიები</h2>
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
              <h3 className="text-xl sm:text-2xl font-bold text-dark-color mb-6">
                ტესტები კატეგორიაში #{selectedCategoryId}
              </h3>

              {quizzes.length === 0 ? (
                <p className="text-sm text-gray-500">ტესტები ვერ მოიძებნა.</p>
              ) : (
                <ul className="space-y-4">
                  {quizzes.map((quiz) => (
                    <li
                      key={quiz.id}
                      className="border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      <h4 className="text-lg font-semibold">{quiz.title}</h4>
                      {quiz.description && <p className="text-sm text-gray-600">{quiz.description}</p>}
                    </li>
                  ))}
                </ul>
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
