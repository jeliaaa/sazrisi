"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";

const tabs = [
  "პროფილი",
  "უსაფრთხოება და კონფიდენციალურობა",
  "გადახდები",
  "შეკვეთების ისტორია",
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("პროფილი");
  const { profileImage, setProfileImage, themeColor, setThemeColor } =
    useUser();

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "Visa", last4: "1234", isDefault: true },
    { id: 2, type: "MasterCard", last4: "5678", isDefault: false },
  ]);

  const handleDelete = (id: number) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "პროფილი":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={profileImage}
                alt="Profile"
                className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover"
              />
              <label
                className="cursor-pointer text-white px-4 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: themeColor }}
              >
                ფოტოს შეცვლა
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">სახელი</label>
              <input
                className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm"
                placeholder="შეიყვანე სახელი"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">ელ.ფოსტა</label>
              <input
                className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm"
                placeholder="შეიყვანე ელ.ფოსტა"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">მოირგე ფეიჯი</h3>
              <div className="flex gap-3">
                {["blue", "red", "black"].map((color) => (
                  <div
                    key={color}
                    onClick={() => setThemeColor(color)}
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
                აირჩიე ფერი - ეს შენი არჩევანია
              </p>
            </div>
          </div>
        );

      case "უსაფრთხოება და კონფიდენციალურობა":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1">
                  შენი არსებული პაროლი
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm"
                  placeholder="არსებული პაროლი"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  შეცვალე პაროლი
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm"
                  placeholder="ახალი პაროლი"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  დაადასტურე პაროლი
                </label>
                <input
                  type="password"
                  className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm"
                  placeholder="დაადასტურე"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="w-48 bg-main-color text-white font-semibold py-3 rounded-xl hover:opacity-90 transition">
                შენახვა
              </button>
            </div>
          </div>
        );

      case "გადახდები":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">
                შენახული გადახდის მეთოდები
              </h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center justify-between border p-4 rounded-xl ${
                      method.isDefault ? "border-main-color" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          method.type === "Visa"
                            ? "/visa.svg"
                            : method.type === "MasterCard"
                            ? "/mastercard.svg"
                            : "/card.svg"
                        }
                        alt={method.type}
                        className="w-10"
                      />
                      <p className="text-sm">
                        {method.type} **** {method.last4}
                        {method.isDefault && (
                          <span className="ml-2 text-xs bg-main-color text-white px-2 py-0.5 rounded">
                            ძირითადი
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => handleDelete(method.id)}
                    >
                      წაშლა
                    </button>
                  </div>
                ))}
                {paymentMethods.length === 0 && (
                  <p className="text-sm text-gray-500">
                    არ გაქვს გადახდის მეთოდები დამატებული
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "შეკვეთების ისტორია":
        return (
          <p className="text-sm">
            აქ იქნება ძველი შეკვეთების და გადახდების სია.
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 py-6 sm:px-6 md:px-10 max-w-5xl mx-auto">
      <div className="w-full border-b-2 mb-6">
        <div className="flex flex-wrap justify-start gap-x-6 gap-y-2 px-2 py-3">
          {tabs.map((tab) => (
            <p
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer text-sm sm:text-base md:text-lg whitespace-nowrap ${
                activeTab === tab
                  ? "underline font-semibold text-main-color"
                  : "text-gray-700"
              }`}
            >
              {tab}
            </p>
          ))}
        </div>
      </div>

      <div className="w-full bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-md min-h-[470px] transition-all duration-300 ease-in-out">
        <h2 className="text-lg sm:text-xl font-bold mb-4">{activeTab}</h2>
        <div
          key={activeTab}
          className="transition-opacity duration-300 opacity-100"
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
