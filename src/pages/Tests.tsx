import { useState } from "react";
import Lock from "../icons/lock-solid.svg?react";
import { Link } from "react-router-dom";

// Define the type for category names
type Category =
  | "მათემატიკა"
  | "ინგლისური"
  | "ქართული"
  | "ისტორია"
  | "ბიოლოგია"
  | "ქიმია"
  | "ფიზიკა";

// Category lock status
const lockedCategories: Category[] = ["ისტორია", "ქიმია"];

// Test data
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
    <div className="w-full min-h-screen p-4 flex flex-col md:flex-row gap-4 bg-gray-50">
      {/* Sidebar: Category List */}
      <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-800 mb-2">ტესტის კატეგორიები</h2>
        <div className="flex flex-wrap md:flex-col gap-2">
          {(Object.keys(testData) as Category[]).map((category) => {
            const isLocked = lockedCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => !isLocked && setSelectedCategory(category)}
                disabled={isLocked}
                className={`relative text-sm px-4 py-2 rounded cursor-pointer font-medium transition flex items-center gap-2
                  ${selectedCategory === category && !isLocked
                    ? "bg-main-color text-texts-color"
                    : isLocked
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "hover:bg-gray-200 text-dark-color"
                  }`}
              >
                {category}
                {isLocked && <Lock className="w-4 h-4 fill-gray-500" />}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4">
        {testData[selectedCategory].map((test, index) => (
          <Link
            to={test.name + "/0"}
            key={index}
            className={`rounded-lg bg-white border ${!test.locked && "cursor-pointer"
              } group border-dark-color p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-base sm:text-lg font-semibold text-dark-color transition`}
          >
            {test.name}
            {test.locked && (
              <div className="flex items-center gap-x-3 mt-2 sm:mt-0 sm:ml-4">
                <span className="sm:group-hover:block block sm:hidden text-sm text-gray-500">
                  ხელმისაწვდომი იქნება 03.06.2025
                </span>
                <Lock className="fill-dark-color w-5 h-5" />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tests;
