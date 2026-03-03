import { Calendar, Monitor, Laptop, Users, MapPin, X, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuizStore } from '../stores/quizStore';
import { useImitatedStore } from '../stores/imitatedStore';
import { generateQuizCard, QuizInfo } from '../functionalComponents/generateQuizCard';
import { useAuthStore } from '../stores/authStore';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_SESSION = {
    date: "Wednesday, March 5, 2026",
    time: "10:00 AM – 12:00 PM",
    location: "Room 204, Building A",
    emptySpaces: 6,
    totalSpaces: 20
};

// ─── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ date, time, laptopMode, onConfirm, onCancel }: { date: string, time: string, laptopMode: string, onConfirm: () => void, onCancel: () => void }) => (
    <div className="w-dvw h-dvh left-0 top-0 flex items-center justify-center bg-black/50 fixed z-50">
        <div className="w-4/5 max-w-md bg-white rounded-xl flex flex-col shadow-2xl">
            <div className="border-b-2 p-4 flex justify-between items-center">
                <span className="title text-lg font-semibold">აპლიკაციის დადასტურება</span>
                <X className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors" onClick={onCancel} />
            </div>

            <div className="p-6 flex flex-col gap-4">
                <p className="plain-text text-gray-600">დარწმუნებული ხართ, რომ გინდათ ამ სესიაზე რეგისტრაცია?</p>

                <div className="flex flex-col gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 plain-text">თარიღი</span>
                        <span className="font-semibold text-gray-800 title">{date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 plain-text">დრო</span>
                        <span className="font-semibold text-gray-800 title">{time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 plain-text">ინფორმაცია მოწყობილობაზე</span>
                        <span className="font-semibold text-gray-800 title">
                            {laptopMode === "my" ? "My Laptop" : "Provided Laptop"}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 plain-text border border-gray-300 text-gray-600 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-pointer"
                    >
                        უარყოფა
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 plain-text bg-main-color hover:opacity-90 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow hover:shadow-md cursor-pointer"
                    >
                        დადასტურება
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const ImitatedApply = () => {
    const { categoryId, quizId } = useParams();
    const [laptopMode, setLaptopMode] = useState("my");
    const [showModal, setShowModal] = useState(false);
    const { fetchQuizStart, quizzStart } = useQuizStore();
    const { fetchApplyImitated } = useImitatedStore();
    const { user } = useAuthStore();
    const session = MOCK_SESSION;

    useEffect(() => {
        if (categoryId && quizId) {
            fetchQuizStart(categoryId, quizId);
        }
    }, [categoryId, quizId, fetchQuizStart]);

    console.log(quizzStart)

    // In your component state:
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleConfirm = async () => {
        setShowModal(false);
        setIsGeneratingPdf(true);

        try {
            // await fetchApplyImitated(quizId!); // ← trigger the fetch to populate the store
            const response = await fetchApplyImitated(quizId!); // ← await and capture return value
            // const response = useImitatedStore.getState().applyResponse;
            console.log("response", response); // verify it's what you expect

            if (response && user) {
                const quizInfo: QuizInfo = {
                    quizId: quizId!,
                    quizTitle: response.quiz_title ?? "Quiz",
                    quizDate: "Date Date",
                    category: categoryId ?? "General",
                    room: 1,
                    location: "location",
                    laptopMode: laptopMode !== "my",
                    code: response.code ?? "N/A",
                };

                await generateQuizCard(user, quizInfo); // ← await so loader stays until done
            }
        } catch (err) {
            console.error("PDF generation failed:", err);
        } finally {
            setIsGeneratingPdf(false);
        }
    };



    return (
        <div className="min-h-screen overflow-y-auto flex flex-col gap-6 bg-gray-50 p-4 sm:p-6 md:p-8">

            {/* ── Session Info Card ───────────────────────────────────────────────── */}
            <div className="w-full flex flex-col gap-6 bg-white p-6 rounded-2xl shadow">
                <div className="bg-main-color flex justify-between items-center rounded-lg px-6 py-4">
                    <h2 className="text-xl font-semibold text-white flex items-center title">
                        <Calendar className="h-6 w-6 mr-2" />
                        იმიტირებული გამოცდის სესიის ინფორმაცია
                    </h2>
                </div>

                {isGeneratingPdf && (
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-color/80 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4">
                            {/* Spinner */}
                            <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-main-color" />
                            <p className="text-lg font-semibold text-white">საგამოცდო ბარათის დაგენერირება…</p>
                            <p className="text-sm text-white/50">თქვენი საგამოცდო ბარათი დაიგენერირება და გადმოიტვირთება თქვენს მოწყობილობაზე</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center p-3 bg-main-color/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-main-color mr-3 shrink-0" />
                        <div>
                            <div className="text-sm text-main-color plain-text">თარიღი & დრო</div>
                            <div className="font-semibold text-main-color title">{session.date}</div>
                            <div className="text-xs text-main-color/70 plain-text">{session.time}</div>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <Users className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                        <div>
                            <div className="text-sm text-green-600 plain-text">თავისუფალი ადგილები</div>
                            <div className={`font-semibold title ${session.emptySpaces <= 3 ? 'text-red-600' : 'text-green-700'}`}>
                                {session.emptySpaces} / {session.totalSpaces}
                            </div>
                            <div className="text-xs text-green-600/70 plain-text">ხელმისაწვდომი ადგილები</div>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-orange-500 mr-3 shrink-0" />
                        <div>
                            <div className="text-sm text-orange-600 plain-text">ლოკაცია</div>
                            <div className="font-semibold text-orange-900 title">{session.location}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Laptop Preference Card ──────────────────────────────────────────── */}
            <div className="w-full flex flex-col gap-6 bg-white p-6 rounded-2xl shadow">
                <div className="bg-main-color flex items-center rounded-lg px-6 py-4">
                    <h2 className="text-xl font-semibold text-white flex items-center title">
                        <Monitor className="h-6 w-6 mr-2" />
                        მოწყობილობის არჩევა
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* My Laptop */}
                    <button
                        onClick={() => setLaptopMode("my")}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-left
              ${laptopMode === "my"
                                ? "border-main-color bg-main-color/10"
                                : "border-gray-200 bg-gray-50 hover:border-gray-300"
                            }`}
                    >
                        <Laptop className={`h-8 w-8 shrink-0 ${laptopMode === "my" ? "text-main-color" : "text-gray-400"}`} />
                        <div>
                            <div className={`font-semibold title ${laptopMode === "my" ? "text-main-color" : "text-gray-700"}`}>
                                ჩემი ლეპტოპი / მოწყობილობა
                            </div>
                            <div className="text-sm plain-text text-gray-500">ჩემი ლეპტოპით მოვალ</div>
                        </div>
                        {laptopMode === "my" && (
                            <CheckCircle className="h-5 w-5 text-main-color ml-auto shrink-0" />
                        )}
                    </button>

                    {/* Your Laptop */}
                    <button
                        onClick={() => { setLaptopMode("yours")}}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-left
              ${laptopMode === "yours"
                                ? "border-main-color bg-main-color/10"
                                : "border-gray-200 bg-gray-50 hover:border-gray-300"
                            }`}
                    >
                        <Monitor className={`h-8 w-8 shrink-0 ${laptopMode === "yours" ? "text-main-color" : "text-gray-400"}`} />
                        <div>
                            <div className={`font-semibold title ${laptopMode === "yours" ? "text-main-color" : "text-gray-700"}`}>
                                ორგანიზაციის ლეპტოპი / მოწყობილობა
                            </div>
                            <div className="text-sm plain-text text-gray-500">ორგანიზაციის ლეპტოპს გამოვიყენებ</div>
                        </div>
                        {laptopMode === "yours" && (
                            <CheckCircle className="h-5 w-5 text-main-color ml-auto shrink-0" />
                        )}
                    </button>
                </div>


                {/* Apply Button */}
                <div className="pt-4 border-t border-gray-200">

                    <button
                        onClick={() => setShowModal(true)}
                        disabled={session.emptySpaces === 0}
                        className="w-full cursor-pointer bg-main-color plain-text hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Calendar className="h-5 w-5 mr-2" />
                        იმიტირებულ გამოცდაზე რეგისტრაცია
                    </button>
                </div>
            </div>

            {/* ── Modal ──────────────────────────────────────────────────────────────── */}
            {showModal && (
                <ConfirmModal
                    date={session.date}
                    time={session.time}
                    laptopMode={laptopMode}
                    onConfirm={handleConfirm}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default ImitatedApply;