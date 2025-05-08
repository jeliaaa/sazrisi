import { useUser } from "../context/UserContext";

const Profile = () => {
  const { profileImage, username, email, themeColor } = useUser(); // Make sure all properties are coming from context

  if (!profileImage || !username || !email) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-gray-600 text-xl">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-6 mb-6">
        {/* Profile Image */}
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

      {/* Profile Details */}
      <div className="bg-white shadow-md rounded-xl p-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Სახელი</h2>
          <p className="text-gray-700">{username}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">ელ.ფოსტა</h2>
          <p className="text-gray-700">{email}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">თემა</h2>
          <p className="text-gray-700">
            დაყენებული ფერის თემა: <span className="capitalize">{themeColor}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
