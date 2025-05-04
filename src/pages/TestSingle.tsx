import React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Question {
    id: string;
    text: string;
    image?: string;
    answers: string[];
}

const questions: Question[] = [
    { id: "1", text: "What is the capital of France?", answers: ["Paris", "London", "Berlin", "Madrid"] },
    { id: "2", text: "What is 2 + 2?", answers: ["3", "4", "5", "6"] },
    { id: "3", text: "Which planet is known as the Red Planet?", answers: ["Earth", "Mars", "Jupiter", "Venus"] },
    { id: "4", text: "What is the largest ocean on Earth?", answers: ["Atlantic", "Indian", "Arctic", "Pacific"] },
    { id: "5", text: "What is 2 + 2?", answers: ["3", "4", "5", "6"] },
    { id: "6", text: "Which planet is known as the Red Planet?", answers: ["Earth", "Mars", "Jupiter", "Venus"] },
    { id: "7", text: "What is the largest ocean on Earth?", answers: ["Atlantic", "Indian", "Arctic", "Pacific"] },

];

const TestSingle: React.FC = () => {
    const { questionId, category } = useParams();
    const navigate = useNavigate();


    const handleStart = () => {
        navigate(`/tests/${category}/1`);
    };

    const handleNavigate = (id: string) => {
        navigate(`/tests/${category}/${id}`);

    };

    if (questionId === '0') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <h1 className="text-2xl font-bold text-dark-color mb-2">მოგესალმებით</h1>
                <p className="text-gray-700 text-center mb-6 max-w-xl">
                    ეს ტესტი შეამოწმებს თქვენს ცოდნას სხვადასხვა თემებზე. გთხოვთ, ყურადღებით წაიკითხოთ შეკითხვები და აირჩიოთ სწორი პასუხი.
                </p>
                <button
                    onClick={handleStart}
                    className="bg-main-color cursor-pointer text-texts-color font-semibold px-6 py-3 rounded hover:opacity-90 transition"
                >
                    ტესტის დაწყება
                </button>
            </div>
        );
    }

    const currentQuestion = questions.find((q) => q.id === questionId);

    if (!currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-red-600 font-medium">შეკითხვა ვერ მოიძებნა.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col gap-8">
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-bold text-dark-color mb-2">ნავიგაცია</h2>
                <div className="flex gap-3 flex-wrap">
                    {questions.map((q) => (
                        <button
                            key={q.id}
                            onClick={() => handleNavigate(q.id)}
                            className={`px-4 py-2 rounded font-medium transition ${q.id === questionId
                                ? "bg-main-color text-texts-color"
                                : "bg-gray-200 text-dark-color hover:bg-main-color hover:text-white"
                                }`}
                        >
                            {q.id}
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-xl font-bold text-dark-color mb-4">
                    შეკითხვა {currentQuestion.id}
                </h1>
                <p className="text-gray-800 mb-4">{currentQuestion.text}</p>
                {currentQuestion.image && (
                    <img src={currentQuestion.image} alt="Question" className="mb-4 rounded" />
                )}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQuestion.answers.map((answer, index) => (
                        <li
                            key={index}
                            className="border border-gray-300 rounded-lg p-3 bg-white hover:bg-main-color hover:text-white transition cursor-pointer"
                        >
                            {answer}
                        </li>
                    ))}
                </ul>
            </div>


        </div>
    );
};

export default TestSingle;
