import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "../stores/quizStore";
import Lock from "../../icons/lock-solid.svg?react";
import { Category } from "../types/types";
// import Clock from "../../icons/clock.svg?react";

const lockedCategories = [2, 5]; // use actual locked IDs here

const Quizs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategoryId = Number(searchParams.get("categoryId"));

  const { categories, fetchCategories } = useQuizStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
            {categories.map((cat : Category) => {
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
                    <span>{cat.name}</span>
                    {isLocked && <Lock className="w-4 h-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-white p-6 rounded-2xl shadow-lg flex items-center justify-center text-gray-400">
          {selectedCategoryId ? (
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-dark-color mb-4">
                ტესტები კატეგორიაში #{selectedCategoryId}
              </h3>
              <p className="text-sm">აქ გამოჩნდება შესაბამისი ტესტების სია</p>
            </div>
          ) : (
            <span>აირჩიეთ კატეგორია მარცხნიდან</span>
          )}
        </main>
      </div>
    </div>
  );
};

export default Quizs;
