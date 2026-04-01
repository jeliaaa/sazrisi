import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useQuizStore } from "../stores/quizStore";
import Lock from "../icons/lock-solid.svg?react";
import { Category } from "../types/types";
import Loader from "../components/reusables/Loader";
import { apiV1 } from "../utils/axios";

interface PaymentModalProps {
  category: Category;
  onClose: () => void;
}

function PaymentModal({ category, onClose }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiV1.post(`/payment/category/${category.id}/pay/`);
      // Redirect browser to BOG hosted payment page
      window.location.href = res.data.redirect_url;
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "გადახდა ვერ განხორციელდა. სცადეთ თავიდან."
      );
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-widest uppercase text-main-color font-bold">გადახდა</span>
          <h2 className="title font-bold text-dark-color leading-snug">{category.title}</h2>
          {category.description && (
            <p className="plain-text text-gray-500 text-sm">{category.description}</p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
          <span className="plain-text text-gray-600">ღირებულება</span>
          <span className="text-2xl font-bold text-dark-color">{category.price} <span className="text-base font-normal text-gray-400">₾</span></span>
        </div>

        {/* Access info */}
        <div className="flex items-start gap-3 bg-main-color/5 border border-main-color/20 rounded-xl px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <p className="plain-text text-sm text-gray-600">გადახდის შემდეგ მიიღებთ <strong>30-დღიან წვდომას</strong> ამ კატეგორიის ყველა ტესტზე.</p>
        </div>

        {/* Error */}
        {error && (
          <p className="plain-text text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-gray-200 plain-text text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            გაუქმება
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-dark-color text-main-color plain-text font-bold shadow hover:bg-gray-800 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-main-color/30 border-t-main-color animate-spin" />
                მიმდინარეობს...
              </>
            ) : (
              <>
                გადახდა
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


// ── Main Quizs page ───────────────────────────────────────────────────────────

const Quizs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategoryId = Number(searchParams.get("categoryId"));

  const { categories, fetchCategories, quizzes, fetchCategoryQuizzes, loading } = useQuizStore();
  const [payingCategory, setPayingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchCategoryQuizzes(selectedCategoryId);
    }
  }, [selectedCategoryId, fetchCategoryQuizzes]);

  const handleCategoryClick = (cat: Category) => {
    if (cat.is_paid && !cat.has_access) {
      // Open payment modal instead of navigating
      setPayingCategory(cat);
    } else {
      navigate(`?categoryId=${cat.id}`);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* Payment modal */}
      {payingCategory && (
        <PaymentModal
          category={payingCategory}
          onClose={() => setPayingCategory(null)}
        />
      )}

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 bg-white p-4 sm:p-6 rounded-2xl shadow top-4">
            <h2 className="title sm:text-xl font-bold text-dark-color mb-4 border-b pb-2">კატეგორიები</h2>
            <ul className="space-y-2">
              {categories.map((cat: Category) => {
                const isLocked = cat.is_paid && !cat.has_access;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-xl transition duration-200 font-medium text-sm sm:text-base ${
                        selectedCategoryId === cat.id && !isLocked
                          ? "bg-main-color text-white shadow"
                          : isLocked
                            ? "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-main-color"
                            : "bg-gray-50 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <span>{cat.title}</span>
                      {isLocked ? (
                        <span className="flex items-center gap-1.5">
                          <span className="text-xs font-bold">{cat.price}₾</span>
                          <Lock className="w-3.5 h-3.5 shrink-0" />
                        </span>
                      ) : cat.is_paid ? (
                        <span className="text-xs text-green-600 font-bold">✓ წვდომა</span>
                      ) : null}
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
                    {quizzes.map((quiz) => (
                      <Link
                        to={`/quiz/${selectedCategoryId}/${quiz.id}`}
                        key={quiz.id}
                      >
                        <div className="border w-full border-gray-200 p-4 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition">
                          <h4 className="title font-semibold">{quiz.title}</h4>
                          {quiz.description && (
                            <p className="plain-text text-gray-600">{quiz.description}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-gray-500">აირჩიეთ კატეგორია მარცხნიდან</span>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Quizs;
