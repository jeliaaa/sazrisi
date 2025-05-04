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
                            className={`cursor-pointer text-base md:text-xl whitespace-nowrap ${selectedOption === option ? 'underline font-semibold text-main-color' : ''
                                }`}
                        >
                            {option}
                        </p>
                    ))}
                </div>

                {/* Leaderboard */}
                <div className="mt-6 w-full overflow-x-auto">
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

                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
