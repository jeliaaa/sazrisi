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






import { useState } from 'react'
import Search from "../icons/search.svg?react"
import Close from "../icons/close.svg?react"
import ChevronDown from "../icons/chevronDown.svg?react"

const mockData = [
    { name: "ნიკა ლომინაძე", score: 95 },
    { name: "თაკო ზოსიძე", score: 88 },
    { name: "საბა საბაშვილი", score: 82 },
    { name: "ანა ბერიძე", score: 78 },
    { name: "გიორგი გიორგაძე", score: 74 },
];

const Leaderboard = () => {
    const [search, setSearch] = useState<string>('');
    const [dropdownValue, setDropdownValue] = useState<string>('აირჩიე კურსი');
    const [selectedOption, setSelectedOption] = useState<string>('დღეს');
    const options = ['დღეს', 'კვირის', 'თვის', 'სემესტრის', 'წლის'];

    const handleClear = () => setSearch('');

    return (
        <div className="w-full md:p-10 flex-col justify-start items-start h-screen">
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-stretch h-auto md:h-[80px] rounded-2xl md:px-6 py-3 w-full">
                <div className="relative w-full md:w-1/2 h-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 fill-main-color" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ძებნა..."
                        className="w-full pl-8 pr-10 bg-gray-100 h-full py-2 text-main-color rounded-xl outline-none text-sm"
                    />
                    {search && (
                        <button
                            onClick={handleClear}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                        >
                            <Close className='fill-main-color' />
                        </button>
                    )}
                </div>

                {/* Dropdown */}
                <div className="relative w-full md:w-1/2 h-full">
                    <select
                        value={dropdownValue}
                        onChange={(e) => setDropdownValue(e.target.value)}
                        className="appearance-none rounded-xl text-main-color bg-gray-100 px-3 h-full w-full py-2 outline-none text-sm"
                    >
                        <option>აირჩიე კურსი</option>
                        <option>ოფცია 1</option>
                        <option>ოფცია 2</option>
                        <option>ოფცია 3</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <ChevronDown className='fill-main-color' />
                    </div>
                </div>
            </div>

            {/* Filter Options */}
            <div className='mt-5 flex-col'>
                <div className='w-full flex gap-x-5 border-y-2 pt-4 pb-3 overflow-x-auto'>
                    {options.map((option, index) => (
                        <p
                            key={index}
                            onClick={() => setSelectedOption(option)}
                            className={`cursor-pointer text-sm md:text-xl whitespace-nowrap ${selectedOption === option ? 'underline font-semibold text-main-color' : ''
                                }`}
                        >
                            {option}
                        </p>
                    ))}
                </div>

                {/* Leaderboard */}
                {/* <div className="mt-6 w-full overflow-x-auto">
                    <table className="w-full table-auto border-collapse text-sm md:text-base">
                        <thead className="text-left">
                            <tr>
                                <th className="py-2 px-4 w-[70%]">სახელი გვარი</th>
                                <th className="py-2 px-4 w-[15%]">ქულა</th>
                                <th className="py-2 px-4 w-[15%]">პოზიცია</th>
                            </tr>
                        </thead>
                        <tbody className='mt-4'>
                            {mockData.map((entry, index) => (
                                <tr key={index} className="hover:bg-gray-50 py-2">
                                    <td className="py-2 px-4 flex items-center gap-x-2 w-[70%]">
                                        <div className='rounded-full aspect-square w-10 bg-gray-300'></div>
                                        {entry.name}
                                    </td>
                                    <td className="py-2 px-4 w-[15%]">
                                        <span className='bg-red-100 text-red-600 px-6 rounded-md py-2'>
                                            {entry.score}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 w-[15%]">
                                        <span className='bg-green-100 m-auto py-3 px-4 rounded-md text-green-600 shadow-xl'>
                                            {index + 1}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div> */}
                <div className="mt-6 w-full overflow-x-auto">
                    <div className="min-w-[600px]">
                        <table className="w-full table-auto border-collapse text-sm md:text-base">
                            <thead className="text-left bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 w-[70%] whitespace-nowrap">სახელი გვარი</th>
                                    <th className="py-2 px-4 w-[15%] whitespace-nowrap">ქულა</th>
                                    <th className="py-2 px-4 w-[15%] whitespace-nowrap">პოზიცია</th>
                                </tr>
                            </thead>
                            <tbody className='mt-4'>
                                {mockData.map((entry, index) => (
                                    <tr key={index} className="hover:bg-gray-50 py-2">
                                        <td className="py-2 px-4 flex items-center gap-x-2 w-[70%] whitespace-nowrap">
                                            <div className='rounded-full aspect-square w-10 bg-gray-300 shrink-0'></div>
                                            {entry.name}
                                        </td>
                                        <td className="py-2 px-4 w-[15%] whitespace-nowrap">
                                            <span className='bg-red-100 text-red-600 px-6 rounded-md py-2 inline-block'>
                                                {entry.score}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 w-[15%] whitespace-nowrap">
                                            <span className='bg-green-100 m-auto py-3 px-4 rounded-md text-green-600 shadow-xl inline-block'>
                                                {index + 1}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
