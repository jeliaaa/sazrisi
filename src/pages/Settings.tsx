"use client";

import { useState, useEffect } from "react";

const tabs = [
  "პროფილი",
  "უსაფრთხოება და კონფიდენციალურობა",
  "გადახდები",
  "შეკვეთების ისტორია",
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("პროფილი");

  const [name, setName] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [phone, setPhone] = useState<string | undefined>(undefined);

  useEffect(() => {
    // fetchUserData().then((data) => {
    //   setName(data.name);
    //   setEmail(data.email);
    //   setPhone(data.phone);
    //   setAge(data.age);
    // });

  }, []);

  const handleSave = () => {
    alert("Profile saved!");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "პროფილი":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">სახელი</label>
              <input
                className="w-full bg-gray-100 p-2 rounded-xl outline-none"
                placeholder="შეიყვანე სახელი"
                value={name ?? ""}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">ელ.ფოსტა</label>
              <input
                className="w-full bg-gray-100 p-2 rounded-xl outline-none"
                placeholder="შეიყვანე ელ.ფოსტა"
                value={email ?? ""}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">ტელეფონის ნომერი</label>
              <input
                className="w-full bg-gray-100 p-2 rounded-xl outline-none"
                placeholder="შეიყვანე ტელეფონის ნომერი"
                value={phone ?? ""}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-xl"
            >
              შენახვა
            </button>
          </div>
        );
      case "უსაფრთხოება და კონფიდენციალურობა":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">შეცვალე პაროლი</label>
              <input
                type="password"
                className="w-full bg-gray-100 p-2 rounded-xl outline-none"
                placeholder="ახალი პაროლი"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">დაადასტურე პაროლი</label>
              <input
                type="password"
                className="w-full bg-gray-100 p-2 rounded-xl outline-none"
                placeholder="დაადასტურე"
              />
            </div>
          </div>
        );
      case "გადახდები":
        return (
          <div className="space-y-4">
            <p>აქ გამოჩნდება გადახდის მეთოდები (მაგ. ბარათი, გადახდის პროვაიდერი და ა.შ.)</p>
          </div>
        );
      case "შეკვეთების ისტორია":
        return (
          <div className="space-y-4">
            <p>აქ იქნება წარსული შეკვეთების და გადახდების სია.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full md:p-10 flex-col justify-start items-start h-screen">
      {/* Tabs */}
      <div className="flex gap-x-5 border-y-2 pt-4 pb-3 overflow-x-auto">
        {tabs.map((tab) => (
          <p
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer text-base md:text-xl whitespace-nowrap ${
              activeTab === tab ? "underline font-semibold text-main-color" : ""
            }`}
          >
            {tab}
          </p>
        ))}
      </div>

      <div className="mt-6 w-full bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">{activeTab}</h2>
        {renderTabContent()}
      </div>
    </div>
  );
}
