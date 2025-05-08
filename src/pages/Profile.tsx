import { useUser } from "../context/UserContext";

const Profile = () => {
  const { profileImage, themeColor, setProfileImage } = useUser();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={profileImage || "/default-profile.png"} // Add default image for when no profile picture is set
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-main-color object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ჩვენი პროფილი</h1>
          <p className="text-gray-600 text-sm">მოგესალმები საკუთარ პროფილზე!</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
        {/* Profile Picture Change */}
        <div className="flex items-center gap-4">
          <button
            className="bg-main-color text-white px-4 py-2 rounded-xl text-sm font-medium"
            onClick={() => document.getElementById('profile-image-upload')?.click()}
          >
            ფოტოს შეცვლა
          </button>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <p className="text-sm text-gray-500">ან ჩამოაგდეთ ფოტო აქ.</p>
        </div>

        {/* Profile Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Სახელი</h2>
          <p className="text-gray-700">მომხმარებლის სახელი</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">ელ.ფოსტა</h2>
          <p className="text-gray-700">example@email.com</p>
        </div>

        {/* Theme Settings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">თემა</h2>
          <p className="text-gray-700">
            დამონტაჟებული ფერის თემა:{" "}
            <span className="capitalize">{themeColor}</span>
          </p>
        </div>

        {/* Theme Color Options */}
        <div className="flex gap-3">
          {["blue", "red", "black"].map((color) => (
            <div
              key={color}
              onClick={() => {}}
              className={`w-8 h-8 rounded-lg cursor-pointer border-2 transition ${
                themeColor === color
                  ? "border-[3px] border-gray-500 scale-105"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          აირჩიე თემა, რომელიც გსურს
        </p>
      </div>
    </div>
  );
};

export default Profile;
