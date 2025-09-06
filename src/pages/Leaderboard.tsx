// import { useState } from 'react';
// import Search from "../icons/search.svg?react";
// import Close from "../icons/close.svg?react";
// import ChevronDown from "../icons/chevronDown.svg?react";

// // Sample data for demonstration
// const mockData = [
//     { name: "ნიკა ლომინაძე", score: 95 },
//     { name: "თაკო ზოსიძე", score: 88 },
//     { name: "საბა საბაშვილი", score: 82 },
//     { name: "ანა ბერიძე", score: 78 },
//     { name: "გიორგი გიორგაძე", score: 74 },
// ];

// const Leaderboard = () => {
//     const [search, setSearch] = useState<string>('');
//     const [dropdownValue, setDropdownValue] = useState<string>('აირჩიე კურსი');
//     const [selectedOption, setSelectedOption] = useState<string>('დღეს');
//     const [sortedData, setSortedData] = useState(mockData);
//     const options = ['დღეს', 'კვირის', 'თვის', 'სემესტრის', 'წლის'];

//     // Filter the data based on search input
//     const filteredData = search
//         ? sortedData.filter(entry => entry.name.toLowerCase().includes(search.toLowerCase()))
//         : sortedData;

//     // Sorting function for leaderboard
//     const handleSort = (key: 'name' | 'score') => {
//         const sorted = [...filteredData].sort((a, b) => {
//             if (key === 'score') {
//                 return b.score - a.score;
//             } else {
//                 return a.name.localeCompare(b.name);
//             }
//         });
//         setSortedData(sorted);
//     };

//     // Pagination logic (disabled when search is active)
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 5;
//     const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//     const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//     const handlePageChange = (direction: 'next' | 'prev') => {
//         if (direction === 'next' && currentPage < totalPages) {
//             setCurrentPage(prev => prev + 1);
//         } else if (direction === 'prev' && currentPage > 1) {
//             setCurrentPage(prev => prev - 1);
//         }
//     };

//     return (
//         <div className="w-full p-5 flex-col justify-start items-start h-screen bg-gray-50">
//             {/* Header Section */}
//             <div className="flex flex-col md:flex-row gap-4 items-center md:items-stretch h-auto md:h-[80px] rounded-2xl md:px-6 py-3 w-full bg-white shadow-md mb-5">
//                 <div className="relative w-full md:w-1/2 h-full">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 fill-main-color" />
//                     <input
//                         type="text"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         placeholder="ძებნა..."
//                         className="w-full pl-8 pr-10 bg-gray-100 h-full py-2 text-main-color rounded-xl outline-none text-sm"
//                     />
//                     {search && (
//                         <button
//                             onClick={() => setSearch('')}
//                             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
//                         >
//                             <Close className="fill-main-color" />
//                         </button>
//                     )}
//                 </div>

//                 {/* Course Dropdown */}
//                 <div className="relative w-full md:w-1/2 h-full">
//                     <select
//                         value={dropdownValue}
//                         onChange={(e) => setDropdownValue(e.target.value)}
//                         className="appearance-none rounded-xl text-main-color bg-gray-100 px-3 h-full w-full py-2 outline-none text-sm"
//                     >
//                         <option>აირჩიე კურსი</option>
//                         <option>ოფცია 1</option>
//                         <option>ოფცია 2</option>
//                         <option>ოფცია 3</option>
//                     </select>
//                     <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
//                         <ChevronDown className="fill-main-color" />
//                     </div>
//                 </div>
//             </div>

//             {/* Filter Options */}
//             <div className="w-full flex gap-x-6 border-y-2 py-4 overflow-x-auto mb-6">
//                 {options.map((option, index) => (
//                     <p
//                         key={index}
//                         onClick={() => setSelectedOption(option)}
//                         className={`cursor-pointer text-base md:text-xl whitespace-nowrap hover:underline ${selectedOption === option ? 'font-semibold text-main-color' : 'text-gray-600'}`}
//                     >
//                         {option}
//                     </p>
//                 ))}
//             </div>

//             {/* Leaderboard Table */}
//             <div className="overflow-x-auto">
//                 <table className="w-full table-auto border-collapse text-sm md:text-base text-gray-700">
//                     <thead className="text-left bg-gray-200">
//                         <tr>
//                             <th className="py-3 px-4 w-[60%] cursor-pointer" onClick={() => handleSort('name')}>სახელი გვარი</th>
//                             <th className="py-3 px-4 w-[20%] cursor-pointer" onClick={() => handleSort('score')}>ქულა</th>
//                             <th className="py-3 px-4 w-[20%]">პოზიცია</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredData.length === 0 ? (
//                             <tr>
//                                 <td colSpan={3} className="py-4 text-center text-gray-500">არაფერი მოიძებნა</td>
//                             </tr>
//                         ) : (
//                             currentData.map((entry, index) => (
//                                 <tr key={index} className="hover:bg-gray-50 transition duration-200 ease-in-out">
//                                     <td className="py-2 px-4 flex items-center gap-x-4 w-[60%]">
//                                         <div className="rounded-full aspect-square w-12 bg-gray-300"></div>
//                                         {entry.name}
//                                     </td>
//                                     <td className="py-2 px-4 w-[20%]">
//                                         <span className="bg-gradient-to-r from-red-200 to-red-400 text-white px-6 py-2 rounded-md">
//                                             {entry.score}
//                                         </span>
//                                     </td>
//                                     <td className="py-2 px-4 w-[20%]">
//                                         <span className={`m-auto py-2 px-4 rounded-md text-white font-semibold shadow-xl ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-green-400'}`}>
//                                             {index + 1}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination Controls */}
//             {!search && filteredData.length > itemsPerPage && (
//                 <div className="flex justify-between items-center mt-6">
//                     <button
//                         onClick={() => handlePageChange('prev')}
//                         disabled={currentPage === 1}
//                         className="px-4 py-2 bg-main-color text-white rounded-md hover:bg-main-color/80 transition"
//                     >
//                         წინ
//                     </button>
//                     <span className="text-gray-700">{currentPage} / {totalPages}</span>
//                     <button
//                         onClick={() => handlePageChange('next')}
//                         disabled={currentPage === totalPages}
//                         className="px-4 py-2 bg-main-color text-white rounded-md hover:bg-main-color/80 transition"
//                     >
//                         შემდეგი
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Leaderboard;







import { useEffect, useState } from 'react';
import Search from "../icons/search.svg?react";
import Close from "../icons/close.svg?react";
import ChevronDown from "../icons/chevronDown.svg?react";
import { useLeaderboardStore } from "../stores/leaderboardStore";
import { useQuizStore } from "../stores/quizStore";
import Placeholder from '../assets/placeholder.png'

type OptionType = "დღეს" | "კვირის" | "თვის" | "სემესტრის" | "წლის";

const Leaderboard = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<OptionType>("დღეს");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [selectedQuizId, setSelectedQuizId] = useState<number | "">("");
  const [leaderboardSize, setLeaderboardSize] = useState<number>(20);

  const { leaderboard, fetchLeaderboard, loading, error } = useLeaderboardStore();
  const { categories, quizzes, fetchCategories, fetchCategoryQuizzes } = useQuizStore();

  const handleClear = () => setSearch("");

  const optionMap: Record<OptionType, "day" | "week" | "month" | "semester" | "year"> = {
    "დღეს": "day",
    "კვირის": "week",
    "თვის": "month",
    "სემესტრის": "semester",
    "წლის": "year",
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch quizzes when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      fetchCategoryQuizzes(Number(selectedCategoryId));
      setSelectedQuizId(""); // reset quiz selection when category changes
    }
  }, [selectedCategoryId, fetchCategoryQuizzes]);

  useEffect(() => {
    fetchLeaderboard(
      optionMap[selectedOption],
      leaderboardSize,
      selectedCategoryId || undefined,
      selectedQuizId || undefined,
      search || undefined
    );
  }, [selectedOption, leaderboardSize, selectedCategoryId, selectedQuizId, search, fetchLeaderboard]);

  const sizeOptions = [3, 5, 10, 15, 20, 50, 80, 100];

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 1000);

    // padStart to always have 2 digits for minutes/seconds, 3 digits for ms
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-10 flex flex-col bg-gray-50">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* Search */}
        <div className='w-full flex justify-between items-center gap-4'>
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 fill-main-color" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ძებნა..."
              className="w-full pl-10 pr-10 bg-white h-12 rounded-xl outline-none text-sm text-main-color shadow-sm"
            />
            {search && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <Close className="fill-main-color" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full md:w-1/3">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : "")}
              className="appearance-none bg-white text-main-color h-12 w-full pl-4 pr-10 rounded-xl outline-none text-sm shadow-sm"
            >
              <option value="">ყველა კურსი</option>
              {categories.map((cat) => (
                <option disabled={!cat.has_access} key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDown className="fill-main-color" />
            </div>
          </div>

          {/* Quiz Dropdown - show only if category selected */}
          {selectedCategoryId && (
            <div className="relative w-full md:w-1/3">
              <select
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value ? Number(e.target.value) : "")}
                className="appearance-none bg-white text-main-color h-12 w-full pl-4 pr-10 rounded-xl outline-none text-sm shadow-sm"
              >
                <option value="">ყველა ქვიზი</option>
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDown className="fill-main-color" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Filters */}
      <div className="mt-6 border-y py-3">
        <div className="flex gap-x-4 flex-wrap">
          {(Object.keys(optionMap) as OptionType[]).map((option) => (
            <p
              key={option}
              onClick={() => setSelectedOption(option)}
              className={`cursor-pointer text-sm md:text-base ${
                selectedOption === option
                  ? "underline font-semibold text-main-color"
                  : "text-gray-600"
              }`}
            >
              {option}
            </p>
          ))}
        </div>
      </div>

      {/* Leaderboard Size Selector */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {sizeOptions.map((size) => (
          <button
            key={size}
            onClick={() => setLeaderboardSize(size)}
            className={`px-4 py-1 rounded-md border ${
              leaderboardSize === size
                ? "bg-main-color text-white"
                : "bg-white text-main-color border-gray-300"
            }`}
          >
            Top {size}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 w-full">
        {loading ? (
          <p className="text-gray-500">იტვირთება...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full text-sm md:text-base bg-white shadow-sm rounded-xl overflow-hidden table-fixed">
            <thead className="text-left bg-gray-100">
              <tr>
                <th className="py-3 px-2 md:px-4 w-1/6 sm:w-[15%]">პოზიცია</th>
                <th className="py-3 px-2 md:px-4 w-1/2 sm:w-[45%]">სახელი გვარი</th>
                <th className="py-3 px-2 md:px-4 w-1/6 sm:w-[15%]">ქულა</th>
                <th className="py-3 px-2 md:px-4 w-1/6 sm:w-[15%]">დრო (წთ:წ:მწ)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.position} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2 ">
                    <span className="bg-green-100 text-green-600 px-4 py-1 rounded-md inline-block shadow text-center w-full sm:w-auto">
                      {entry.position}
                    </span>
                  </td>
                  <td className="py-3 px-2 md:px-4 flex items-center gap-x-2">
                    <img 
                      src={entry?.user?.avatar?.url ? import.meta.env.VITE_BACKEND_APP_URL + entry?.user?.avatar?.url : Placeholder} 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover bg-gray-300 shrink-0" 
                    />
                    <span className="truncate">
                      {entry.user.firstname} {entry.user.lastname}
                    </span>
                  </td>
                  <td className="py-3 px-2 md:px-4">
                    <span className="bg-red-100 text-red-600 px-4 py-1 rounded-md inline-block text-center w-full sm:w-auto">
                      {entry.total_score}
                    </span>
                  </td>
                  <td className="py-3 px-2 md:px-4">
                    <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-md inline-block text-center w-full sm:w-auto">
                      {entry.total_time_taken_seconds
                        ? formatTime(entry.total_time_taken_seconds)
                        : "00:00:000"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
