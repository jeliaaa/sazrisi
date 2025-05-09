import { useState } from "react";
import { Link } from "react-router-dom";
import Lock from "../icons/lock-solid.svg?react";

type Category =
  | "მათემატიკა"
  | "ინგლისური"
  | "ქართული"
  | "ისტორია"
  | "ბიოლოგია"
  | "ქიმია"
  | "ფიზიკა";

const lockedCategories: Category[] = ["ისტორია", "ქიმია"];

type TestItem = { name: string; locked: boolean };

const testData: Record<Category, TestItem[]> = {
  მათემატიკა: [
    { name: "მათემატიკა - ეროვნული N1", locked: false },
    { name: "მათემატიკა - ეროვნული N2", locked: true },
    { name: "მათემატიკა - ეროვნული N3", locked: false },
  ],
  ინგლისური: [
    { name: "ინგლისური - ეროვნული N1", locked: false },
    { name: "ინგლისური - ეროვნული N2", locked: true },
    { name: "ინგლისური - ეროვნული N3", locked: true },
  ],
  ქართული: [
    { name: "ქართული - ეროვნული N1", locked: false },
    { name: "ქართული - ეროვნული N2", locked: false },
    { name: "ქართული - ეროვნული N3", locked: true },
  ],
  ისტორია: [
    { name: "ისტორია - ეროვნული N1", locked: true },
    { name: "ისტორია - ეროვნული N2", locked: false },
    { name: "ისტორია - ეროვნული N3", locked: false },
  ],
  ბიოლოგია: [
    { name: "ბიოლოგია - ეროვნული N1", locked: false },
    { name: "ბიოლოგია - ეროვნული N2", locked: false },
    { name: "ბიოლოგია - ეროვნული N3", locked: true },
  ],
  ქიმია: [
    { name: "ქიმია - ეროვნული N1", locked: true },
    { name: "ქიმია - ეროვნული N2", locked: true },
    { name: "ქიმია - ეროვნული N3", locked: false },
  ],
  ფიზიკა: [
    { name: "ფიზიკა - ეროვნული N1", locked: false },
    { name: "ფიზიკა - ეროვნული N2", locked: false },
    { name: "ფიზიკა - ეროვნული N3", locked: true },
  ],
};

const Tests = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("მათემატიკა");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-4 md:p-8 gap-6 font-sans">
      {/* Sidebar */}
      <aside className="md:w-64 w-full bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-dark-color mb-4 border-b pb-2">📚 კატეგორიები</h2>
        <ul className="space-y-2">
          {(Object.keys(testData) as Category[]).map((category) => {
            const isLocked = lockedCategories.includes(category);
            return (
              <li key={category}>
                <button
                  onClick={() => !isLocked && setSelectedCategory(category)}
                  disabled={isLocked}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-xl transition duration-200 font-medium ${
                    selectedCategory === category && !isLocked
                      ? "bg-main-color text-white shadow"
                      : isLocked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-50 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <span>{category}</span>
                  {isLocked && <Lock className="w-4 h-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold text-dark-color mb-6">{selectedCategory}</h3>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {testData[selectedCategory].map((test, index) => (
            <div
              key={index}
              className={`group p-5 border rounded-2xl transition-all duration-200 flex flex-col justify-between gap-3 shadow-sm ${
                test.locked
                  ? "border-gray-300 bg-gray-100 text-gray-500"
                  : "border-main-color bg-white hover:bg-main-color hover:text-white"
              }`}
            >
              <span className="text-lg font-semibold">{test.name}</span>

              {test.locked ? (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="hidden sm:inline">🕓 ხელმისაწვდომია 03.06.2025</span>
                  <Lock className="w-5 h-5" />
                </div>
              ) : (
                <Link
                  to={`/test/${encodeURIComponent(test.name)}/0`}
                  className="text-sm font-semibold text-main-color group-hover:text-white transition-colors"
                >
                  დაწყება →
                </Link>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Tests;
