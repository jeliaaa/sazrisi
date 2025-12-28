import { useAuthStore } from "../stores/authStore";
import Placeholder from '../assets/placeholder.png'
import { useStatisticsStore } from "../stores/statsStore";
import { useEffect } from "react";

const Profile = () => {
  const { loading: authLoading, user } = useAuthStore();
  const { loading: statsLoading , fetchStatistics, stats } = useStatisticsStore();

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  if (statsLoading || authLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-gray-600 text-xl">ინფორმაციის ჩატვირთვა...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-4 py-6 md:px-8 max-w-4xl mx-auto font-sans">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={user?.avatar?.url ? import.meta.env.VITE_BACKEND_APP_URL + user?.avatar?.url : Placeholder}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-main-color object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">Ჩემი პროფილი</h1>
          <p className="text-gray-600 text-sm">მოგესალმები საკუთარ პროფილზე!</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Სახელი</h2>
          <p className="text-gray-700">{user?.firstname} {user?.lastname}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">ელ.ფოსტა</h2>
          <p className="text-gray-700">{user?.email}</p>
        </div>
        {/* <div>
          <h2 className="text-lg font-semibold">თემა</h2>
          <p className="text-gray-700">
            დაყენებული ფერის თემა: <span className="capitalize">{user?.preferences?.theme_color}</span>
          </p>
        </div> */}
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center pb-28 md:pb-10">
        <StatCard label="გავლილი ტესტები" value={stats?.overall.total_quizzes_taken} />
        <StatCard label="საერთო ქულა" value={stats?.overall.total_accumulated_points} />
        <StatCard label="საუკეთესო შედეგი" value={`${stats?.overall.best_result_percent ? (stats?.overall.best_result_percent / 30).toFixed(2) : "" }%`} />
        <StatCard label="აქტიური დღეები" value={stats?.overall.login_count} />
        <StatCard label="სულ სწორი პასუხები" value={stats?.overall.total_answers} />
        <StatCard label="სულ არასწორი პასუხები" value={stats?.overall.total_errors} />
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
    <h3 className="text-2xl font-bold text-main-color">{value}</h3>
    <p className="text-gray-600 text-sm mt-1">{label}</p>
  </div>
);

export default Profile;
