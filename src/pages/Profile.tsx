import { useUser } from "../context/UserContext";

const Profile = () => {
  const { profileImage } = useUser();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={profileImage}
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
          <p className="text-gray-700">მომხმარებლის სახელი</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">ელ.ფოსტა</h2>
          <p className="text-gray-700">example@email.com</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">თემა</h2>
          <p className="text-gray-700">დაყენებული ფერის თემა: <span className="capitalize">{useUser().themeColor}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
