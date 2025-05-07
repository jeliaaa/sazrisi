"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";

const tabs = ["პროფილი", "უსაფრთხოება და კონფიდენციალურობა", "გადახდები", "შეკვეთების ისტორია"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("პროფილი");
  const [themeColor, setThemeColor] = useState("blue");
  const { profileImage, setProfileImage } = useUser();

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
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img src={profileImage} alt="Profile" className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover" />
              <label className="cursor-pointer bg-main-color text-white px-4 py-2 rounded-xl text-sm font-medium">
                ფოტოს შეცვლა
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">სახელი</label>
              <input
                className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm"
                placeholder="შეიყვანე სახელი"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1">ელ.ფოსტა</label>
              <input
                className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm"
                placeholder="შეიყვანე ელ.ფოსტა"
              />
            </div>

            {/* Theme Color */}
            <div>
              <h3 className="text-sm font-semibold mb-2">მოირგე ფეიჯი</h3>
              <div className="flex gap-3">
                {["blue", "red", "black"].map((color) => (
                  <div
                    key={color}
                    onClick={() => setThemeColor(color)}
                    className={`w-8 h-8 rounded-lg cursor-pointer border-2 transition ${
                      themeColor === color ? "border-main-color scale-105" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">აირჩიე ფერი - ეს შენი არჩევანია</p>
            </div>
          </div>
        );

      case "უსაფრთხოება და კონფიდენციალურობა":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">შეცვალე პაროლი</label>
              <input type="password" className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm" placeholder="ახალი პაროლი" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">დაადასტურე პაროლი</label>
              <input type="password" className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm" placeholder="დაადასტურე" />
            </div>
          </div>
        );

      case "გადახდები":
        return <p className="text-sm">აქ გამოჩნდება გადახდის მეთოდები (მაგ. ბარათი, გადახდის პროვაიდერი და ა.შ.)</p>;

      case "შეკვეთების ისტორია":
        return <p className="text-sm">აქ იქნება ძველი შეკვეთების და გადახდების სია.</p>;

      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 py-6 sm:px-6 md:px-10 max-w-5xl mx-auto">
      {/* Full-width Tabs */}
      <div className="w-full border-b-2 mb-6">
        <div className="flex flex-wrap justify-start gap-x-6 gap-y-2 px-2 py-3">
          {tabs.map((tab) => (
            <p
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer text-sm sm:text-base md:text-lg whitespace-nowrap ${
                activeTab === tab ? "underline font-semibold text-main-color" : "text-gray-700"
              }`}
            >
              {tab}
            </p>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-md">
        <h2 className="text-lg sm:text-xl font-bold mb-4">{activeTab}</h2>
        {renderTabContent()}
      </div>
    </div>
  );
}
