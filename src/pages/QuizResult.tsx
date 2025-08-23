import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Trophy, Target, Calendar, Timer, Loader } from 'lucide-react';
import { useQuizStore } from '../stores/quizStore';
import { useNavigate, useParams } from 'react-router-dom';
import CkeditorContentViewer from '../components/CkEditorContentViewer';

const QuizResultPage = () => {
    const { attemptId } = useParams()
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const { attempt, fetchResults, loading } = useQuizStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (attemptId) {
            fetchResults(parseInt(attemptId!))
        }
    }, [attemptId, fetchResults])

    const formatDate = (dateString: string | null) => {
        if (dateString) {
            return new Date(parseFloat(dateString)).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const getScoreColor = (percentage: string | null) => {
        if (percentage) {
            if (parseFloat(percentage) >= 80) return 'text-green-600';
            if (parseFloat(percentage) >= 60) return 'text-yellow-600';
        }
        return 'text-red-600';
    };

    const getScoreBgColor = (percentage: number) => {
        if (percentage! >= 80) return 'bg-green-100 border-green-200';
        if (percentage! >= 60) return 'bg-yellow-100 border-yellow-200';
        return 'bg-red-100 border-red-200';
    };

    console.log(attempt);

    if (loading) return <Loader />

    return (
        attempt && <div className="bg-gradient-to-br h-dvh overflow-y-scroll from-indigo-50 via-white to-purple-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">ქვიზის შედეგი</h1>
                    <p className="text-gray-600">დეტალური შესრულების ანალიზი</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(parseFloat(attempt?.percentage))} backdrop-blur-sm`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">დაგროვებული ქულა</p>
                                <p className={`text-3xl font-bold ${getScoreColor(attempt?.percentage)}`}>
                                    {attempt?.score}
                                </p>
                            </div>
                            <Trophy className={`h-8 w-8 ${getScoreColor(attempt?.percentage)}`} />
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-blue-100 border-2 border-blue-200 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">სწორი პასუხები</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {attempt?.correct_answers}/{attempt?.total_questions}
                                </p>
                            </div>
                            <Target className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-purple-100 border-2 border-purple-200 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">დახარჯული დრო</p>
                                <p className="text-2xl font-bold text-purple-600">{attempt?.time_taken}</p>
                            </div>
                            <Clock className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-gray-100 border-2 border-gray-200 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">ქუიზის ID</p>
                                <p className="text-3xl font-bold text-gray-600">#{attempt?.id}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Timer className="h-5 w-5 mr-2" />
                        ქვიზის დროით ბაზი
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="text-sm text-gray-600">დაწყების თარიღი</p>
                                <p className="font-medium">{formatDate(attempt?.started_at)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div>
                                <p className="text-sm text-gray-600">დასრულების თარიღი</p>
                                <p className="font-medium">{formatDate(attempt?.completed_at)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Details */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">კითხვების დეტალური ანალიზი</h3>
                    </div>

                    {/* Question Tabs */}
                    <div className="flex border-b border-gray-200">
                        {attempt?.detailed_answers?.map((item: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setSelectedQuestion(index)}
                                className={`px-6 py-3 text-sm font-medium transition-colors ${selectedQuestion === index
                                    ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                შეკითხვა {item.question.order}
                                {item.user_answer.is_correct ? (
                                    <CheckCircle className="inline h-4 w-4 ml-1 text-green-500" />
                                ) : (
                                    <XCircle className="inline h-4 w-4 ml-1 text-red-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Question Content */}
                    <div className="p-6">
                        {attempt?.detailed_answers?.map((item: any, index: number) => (
                            <div
                                key={index}
                                className={`${selectedQuestion === index ? 'block' : 'hidden'}`}
                            >
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <CkeditorContentViewer html={item?.question?.question_text} />
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.question.question_type === 'single'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {item.question.question_type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                დრო: {item.user_answer.time_taken}s
                                            </span>
                                        </div>
                                    </div>

                                    {/* Answer Options */}
                                    <div className="space-y-3">
                                        {item.question.answers.map((answer: any) => {
                                            const isUserSelected = item.user_answer.selected_answers.includes(answer.id);
                                            const isCorrect = answer.is_correct;

                                            let className = "p-4 rounded-lg border-2 transition-all ";
                                            if (isCorrect && isUserSelected) {
                                                className += "bg-green-100 border-green-300 text-green-800";
                                            } else if (isCorrect && !isUserSelected) {
                                                className += "bg-green-50 border-green-200 text-green-700";
                                            } else if (!isCorrect && isUserSelected) {
                                                className += "bg-red-100 border-red-300 text-red-800";
                                            } else {
                                                className += "bg-gray-50 border-gray-200 text-gray-600";
                                            }

                                            return (
                                                <div key={answer.id} className={className}>
                                                    <div className="flex items-center justify-between">
                                                        <CkeditorContentViewer html={answer.answer_text} />
                                                        <div className="flex items-center space-x-2">
                                                            {isUserSelected && (
                                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                    შენი პასუხი
                                                                </span>
                                                            )}
                                                            {isCorrect && (
                                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">აღებული ქულა</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {item.user_answer.score_earned} / {item.question.score} points
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">სტატუსი</p>
                                                <p className={`text-lg font-bold ${item.user_answer.is_correct ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {item.user_answer.is_correct ? 'სწორია' : 'არ არის სწორი'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {item?.question?.explanation && (
                                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <h5 className="font-medium text-yellow-800 mb-2">განმარტება</h5>
                                            <CkeditorContentViewer html={item?.question?.explanation} />
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 text-center space-x-4">
                    <button onClick={() => navigate("/categories")} className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors">
                        კატეგორიები
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResultPage;