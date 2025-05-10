"use client";

import { useUser } from "../hooks/useUser";

const Main = () => {
  const { profileImage, themeColor } = useUser();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:pb-0 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">მოგესალმები!</h1>
          <p className="text-gray-500 mt-1">სასიამოვნოა შენი ხილვა ჯელო.</p>
        </div>
        <img
          src={profileImage}
          alt="Profile"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 shadow-md"
          style={{ borderColor: themeColor }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="შესრულებული ტესტები" value="12" color={themeColor} />
        <StatCard label="საშუალო ქულა" value="87%" color={themeColor} />
        <StatCard label="რანკი რეგიონში" value="#5" color={themeColor} />
        <StatCard label="აქტიური ტესტები" value="3" color={themeColor} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NavCard title="ჩემი ტესტები" href="/tests" color={themeColor} />
        <NavCard title="შედეგები" href="/results" color={themeColor} />
        <NavCard title="პირადი კაბინეტი" href="/settings" color={themeColor} />
      </div>

{/* ჯიპიტას ნაყლევები */}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">ბოლო აქტივობები</h2>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex justify-between items-center">
            <span>✅ ტესტი 'მათემატიკა A' დასრულდა</span>
            <span className="text-xs text-gray-400">3 დღის წინ</span>
          </li>
          <li className="flex justify-between items-center">
            <span>📊 მიღწეული ქულა: 92%</span>
            <span className="text-xs text-gray-400">3 დღის წინ</span>
          </li>
          <li className="flex justify-between items-center">
            <span>📝 ახალი ტესტი დაემატა: 'ფიზიკა B'</span>
            <span className="text-xs text-gray-400">1 დღის წინ</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4" style={{ borderColor: color }}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

const NavCard = ({
  title,
  href,
  color,
}: {
  title: string;
  href: string;
  color: string;
}) => {
  return (
    <a
      href={href}
      className="block bg-white hover:bg-gray-50 transition rounded-xl shadow p-5 border-l-4"
      style={{ borderColor: color }}
    >
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">დეტალების ნახვა</p>
    </a>
  );
};

export default Main;


