import { Calendar, Monitor, Laptop, Users, MapPin, X, CheckCircle, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useImitatedStore } from '../stores/imitatedStore';
import { generateQuizCard, QuizInfo } from '../functionalComponents/generateQuizCard';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import { apiV1 } from '../utils/axios';


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
                            {laptopMode === "my" ? "ჩემი მოწყობილობა" : "ორგანიზაციის მოწყობილობა"}
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


// ─── Payment Gate ──────────────────────────────────────────────────────────────
function PaymentGate({ quizId, title, price }: { quizId: string; title: string; price: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePay = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiV1.post(`/payment/imitation-quiz/${quizId}/pay/`);
            window.location.href = res.data.redirect_url;
        } catch (err: any) {
            setError(err?.response?.data?.error || 'გადახდა ვერ განხორციელდა. სცადეთ თავიდან.');
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 bg-white p-6 rounded-2xl shadow">
            <div className="bg-main-color flex items-center rounded-lg px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center title">
                    <BookOpen className="h-6 w-6 mr-2" />
                    გადახდა საჭიროა
                </h2>
            </div>

            <div className="flex flex-col gap-4">
                <p className="plain-text text-gray-600">
                    <strong>{title}</strong> — ფასიანი გამოცდაა. გადახდის შემდეგ მიიღებთ <strong>30-დღიან წვდომას</strong> ამ სესიაზე.
                </p>

                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
                    <span className="plain-text text-gray-600">ღირებულება</span>
                    <span className="text-2xl font-bold text-dark-color">
                        {price} <span className="text-base font-normal text-gray-400">₾</span>
                    </span>
                </div>

                {error && (
                    <p className="plain-text text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
                )}

                <button
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full cursor-pointer bg-dark-color plain-text hover:bg-gray-800 disabled:opacity-40 text-main-color font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 rounded-full border-2 border-main-color/30 border-t-main-color animate-spin" />
                            მიმდინარეობს...
                        </>
                    ) : (
                        <>
                            გადახდა
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}


// ─── Main Component ────────────────────────────────────────────────────────────
const ImitatedApply = () => {
    const { categoryId, quizId } = useParams();
    const navigate = useNavigate();
    const [laptopMode, setLaptopMode] = useState("my");
    const [showModal, setShowModal] = useState(false);
    const { fetchApplyImitated, fetchCategoryQuizzes, quizzes } = useImitatedStore();
    const { user } = useAuthStore();
    const session = quizzes.find(q => q.id === Number(quizId)) || null;

    useEffect(() => {
        if (categoryId && quizId) {
            fetchCategoryQuizzes(parseInt(categoryId));
        }
    }, [categoryId, quizId, fetchCategoryQuizzes]);

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleConfirm = async () => {
        setShowModal(false);
        setIsGeneratingPdf(true);

        try {
            const response = await fetchApplyImitated(quizId!, laptopMode);

            if (response && user) {
                const quizInfo: QuizInfo = {
                    quizId: quizId!,
                    quizTitle: session?.title ?? "Quiz",
                    quizDescription: session?.description ?? "",
                    quizTimeLimit: session?.time_limit ?? 0,
                    quizStartDate: session?.start_datetime,
                    quizEndDate: session?.end_datetime,
                    category: categoryId ?? "General",
                    room: 1,
                    location: session?.location ?? "N/A",
                    laptopMode: laptopMode !== "my",
                    code: response.code ?? "N/A",
                };

                await generateQuizCard(user, quizInfo);
                navigate(`/imitated/?categoryId=${categoryId}`);
            }
        } catch (err) {
            console.error("PDF generation failed:", err);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    // Payment gate: session loaded, is paid, no access
    if (session && session.is_paid && !session.has_access) {
        return (
            <div className="min-h-screen overflow-y-auto flex flex-col gap-6 bg-gray-50 p-4 sm:p-6 md:p-8">
                <PaymentGate
                    quizId={quizId!}
                    title={session.title}
                    price={session.price}
                />
            </div>
        );
    }

    return (
        session && <div className="min-h-screen overflow-y-auto flex flex-col gap-6 bg-gray-50 p-4 sm:p-6 md:p-8">

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
                            <div className="font-semibold text-main-color title">{new Date(session.start_datetime).toLocaleString("ka-GE")} - <br />{new Date(session?.end_datetime).toLocaleString("ka-GE")}</div>
                            <div className="text-xs text-main-color/70 plain-text">{session?.time_limit} წუთი</div>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <Users className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                        <div>
                            <div className="text-sm text-green-600 plain-text">თავისუფალი ადგილები</div>
                            <div className={`font-semibold title ${session?.max_space - session?.user_count <= 3 ? 'text-red-600' : 'text-green-700'}`}>
                                {session?.max_space - session?.user_count} / {session?.max_space}
                            </div>
                            <div className="text-xs text-green-600/70 plain-text">ხელმისაწვდომი ადგილები</div>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-orange-500 mr-3 shrink-0" />
                        <div>
                            <div className="text-sm text-orange-600 plain-text">ლოკაცია</div>
                            <div className="font-semibold text-orange-900 title">{session?.location}</div>
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

                    {/* Company Laptop */}
                    <button
                        onClick={() => { setLaptopMode("company"); }}
                        disabled={session.available_laptops <= 0 && laptopMode !== "company"}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-left
              ${laptopMode === "company"
                                ? "border-main-color bg-main-color/10"
                                : "border-gray-200 bg-gray-50 hover:border-gray-300"
                            }`}
                    >
                        <Monitor className={`h-8 w-8 shrink-0 ${laptopMode === "company" ? "text-main-color" : "text-gray-400"}`} />
                        <div>
                            <div className={`font-semibold title ${laptopMode === "company" ? "text-main-color" : "text-gray-700"}`}>
                                ორგანიზაციის ლეპტოპი / მოწყობილობა <br />
                                დარჩა : {session.available_laptops - session.registered_laptops}
                            </div>
                            <div className="text-sm plain-text text-gray-500">ორგანიზაციის ლეპტოპს გამოვიყენებ</div>
                        </div>
                        {laptopMode === "company" && (
                            <CheckCircle className="h-5 w-5 text-main-color ml-auto shrink-0" />
                        )}
                    </button>
                </div>

                {/* Apply Button */}
                <div className="pt-4 border-t border-gray-200">
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={session.is_valid_space === false || session.is_active === true}
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
                    date={new Date(session.start_datetime).toLocaleDateString("ka-GE")}
                    time={new Date(session.start_datetime).toLocaleDateString("ka-GE")}
                    laptopMode={laptopMode}
                    onConfirm={handleConfirm}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default ImitatedApply;
