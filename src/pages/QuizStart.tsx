import { Clock, Trophy, Target, BookOpen, Star, FileQuestionMark, X } from 'lucide-react'
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuizStore } from '../stores/quizStore';
import Loader from '../components/reusables/Loader';
import { useAttemptStore } from '../stores/attemptStore';
import { apiV1 } from '../utils/axios';

// ── Payment Gate ──────────────────────────────────────────────────────────────

function PaymentGate({ quizId, title, price }: { quizId: string; title: string; price: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePay = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiV1.post(`/payment/quiz/${quizId}/pay/`);
            window.location.href = res.data.redirect_url;
        } catch (err: any) {
            setError(err?.response?.data?.error || 'გადახდა ვერ განხორციელდა. სცადეთ თავიდან.');
            setLoading(false);
        }
    };

    return (
        <div className='w-full flex flex-col gap-6 bg-white p-6 rounded-2xl shadow'>
            <div className="bg-main-color flex items-center rounded-lg px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center title">
                    <BookOpen className="h-6 w-6 mr-2" />
                    გადახდა საჭიროა
                </h2>
            </div>

            <div className="flex flex-col gap-4">
                <p className="plain-text text-gray-600">
                    <strong>{title}</strong> — ფასიანი ტესტია. გადახდის შემდეგ მიიღებთ <strong>30-დღიან წვდომას</strong>.
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

// ── Main Component ────────────────────────────────────────────────────────────

const QuizStart = () => {
    const [questionModal, setQuestionModal] = useState<boolean>(false);
    const [innerLoading, setInnerLoading] = useState<boolean>(true);
    const { catId, id } = useParams();
    const { loading, fetchQuizStart, quizzStart } = useQuizStore();
    const { startQuiz, attempt, loading: attemptLoading } = useAttemptStore();
    const nav = useNavigate();

    useEffect(() => {
        if (catId && id) {
            fetchQuizStart(catId, id)
        }
    }, [fetchQuizStart, catId, id]);

    if (attempt && !attemptLoading && !innerLoading) {
        return <Navigate to={`${attempt.id}`} />;
    }

    if (loading || attemptLoading) {
        return <Loader />;
    }

    const handleStartQuiz = async () => {
        setInnerLoading(false)
        if (catId && id) {
            const newAttempt = await startQuiz(catId, id);
            if (newAttempt) {
                nav(`${newAttempt.id}`);
            }
        }
    };

    // Payment gate: quiz is paid and user has no access
    if (quizzStart && quizzStart.is_paid && !quizzStart.has_access) {
        return (
            <div className='min-h-screen overflow-y-auto flex flex-col gap-6 bg-gray-50 p-4 sm:p-6 md:p-8'>
                <PaymentGate
                    quizId={id!}
                    title={quizzStart.title}
                    price={quizzStart.price}
                />
            </div>
        );
    }

    return (
        <div className='min-h-screen overflow-y-auto flex flex-col gap-6 bg-gray-50 p-4 sm:p-6 md:p-8'>

            {/* Quiz Info Card */}
            <div className='w-full flex flex-col gap-6 bg-white p-6 rounded-2xl shadow'>
                <div className="bg-main-color flex justify-between items-center rounded-lg px-6 py-4">
                    <h2 className="text-xl font-semibold text-white flex items-center title">
                        <BookOpen className="h-6 w-6 mr-2" />
                        ქუიზის ინფორმაცია
                    </h2>
                    <FileQuestionMark className="h-6 w-6 mr-2 cursor-pointer animate-bounce" color='white' onClick={() => setQuestionModal(true)} />
                </div>

                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 title">{quizzStart?.title}</h3>
                    <p className="text-gray-600 plain-text">{quizzStart?.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center p-3 bg-main-color/10 rounded-lg">
                        <Target className="h-5 w-5 text-main-color mr-3" />
                        <div>
                            <div className="text-sm text-main-color plain-text">შეკითხვების რაოდენობა</div>
                            <div className="font-semibold text-main-color title">{quizzStart?.total_questions}</div>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <Star className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                            <div className="text-sm text-green-600 plain-text">ქულა</div>
                            <div className="font-semibold text-green-900 title">{quizzStart?.total_score}</div>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                        <Clock className="h-5 w-5 text-orange-500 mr-3" />
                        <div>
                            <div className="text-sm text-orange-600 plain-text">დრო</div>
                            <div className="font-semibold text-orange-900 title">{quizzStart?.time_limit} წთ</div>
                        </div>
                    </div>
                </div>

                {/* Start Button */}
                <div className="pt-4 border-t border-gray-200">
                    <button
                        onClick={() => handleStartQuiz()}
                        className="w-full cursor-pointer bg-main-color plain-text hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <BookOpen className="h-5 w-5 mr-2" />
                        {quizzStart?.attempt ? "სავარჯიშო ვერსიის გახსნა" : "ტესტის დაწყება"}
                    </button>
                </div>
            </div>

            {/* Result Section */}
            <div className='w-full flex flex-col gap-6 bg-white p-6 rounded-2xl shadow'>
                <div className="bg-gradient-to-r from-main-color to-main-color rounded-lg px-6 py-4">
                    <h2 className="text-xl font-semibold text-white flex items-center title">
                        <Trophy className="h-6 w-6 mr-2" />
                        [მალე...] სტატისტიკური შედეგი (თქვენი პროგრესი შეგიძლიათ იხილოთ პირად კაბინეტშიც)
                    </h2>
                </div>
            </div>

            {questionModal &&
                <div className='w-dvw h-dvh left-0 top-0 flex items-center justify-center bg-black/50 absolute z-50'>
                    <div className='w-4/5 h-2/3 bg-white rounded-xl flex flex-col'>
                        <div className='border-b-2 p-4 flex justify-between items-center'>
                            <span className='title'>ინფორმაცია ტესტის შესახებ</span>
                            <X className='w-6 h-6 cursor-pointer' onClick={() => setQuestionModal(false)} />
                        </div>
                        <div className='plain-text p-6'>
                            ინფორმაცია იმაზე თუ როგორ მუშაობს ტესტები.
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default QuizStart
