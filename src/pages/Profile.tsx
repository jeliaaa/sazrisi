import { useAuthStore } from "../stores/authStore";

const Profile = () => {
  const { loading, user } = useAuthStore();


  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-gray-600 text-xl">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-4 py-6 md:px-8 max-w-4xl mx-auto font-sans">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={import.meta.env.VITE_BACKEND_APP_URL + user?.avatar?.url}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-main-color object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">Ჩვენი პროფილი</h1>
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
          {user?.avatar?.url}
          <p className="text-gray-700">{user?.email}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">თემა</h2>
          <p className="text-gray-700">
            დაყენებული ფერის თემა: <span className="capitalize">{user?.preferences?.theme_color}</span>
          </p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center pb-28 md:pb-10">
        <StatCard label="გავლილი ტესტები" value="24" />
        <StatCard label="ვიდეო გაკვეთილები" value="12" />
        <StatCard label="საერთო ქულა" value="760" />
        <StatCard label="საუკეთესო შედეგი" value="95%" />
        <StatCard label="აქტიური დღეები" value="18" />
        <StatCard label="ქულები ამ კვირაში" value="120" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
    <h3 className="text-2xl font-bold text-main-color">{value}</h3>
    <p className="text-gray-600 text-sm mt-1">{label}</p>
  </div>
);

export default Profile;
