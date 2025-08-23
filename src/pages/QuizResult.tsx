import { useEffect, useState } from 'react';
import { Clock, Trophy, Target, Calendar, Timer, Loader } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import CkeditorContentViewer from '../components/CkEditorContentViewer';
import { useAttemptStore } from '../stores/attemptStore';
import { Question } from '../types/types';

const QuizResultPage = () => {
    const { attemptId } = useParams();
    const [activeTab, setActiveTab] = useState<'correct' | 'incorrect'>('correct');
    const { attempt, fetchResult, loading } = useAttemptStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (attemptId) {
            fetchResult(parseInt(attemptId!));
        }
    }, [attemptId, fetchResult]);

    const formatDate = (dateString: string | null) => {
        if (dateString) {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
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
        if (percentage >= 80) return 'bg-green-100 border-green-200';
        if (percentage >= 60) return 'bg-yellow-100 border-yellow-200';
        return 'bg-red-100 border-red-200';
    };

    if (loading) return <Loader />;

    // Split questions into correct and incorrect
    const correctQuestions = attempt?.questions?.filter(
        (q: Question) => q.user_answer?.is_correct
    );
    const incorrectQuestions = attempt?.questions?.filter(
        (q: Question) => !q.user_answer?.is_correct
    );

    return (
        attempt && (
            <div className="bg-gradient-to-br h-dvh overflow-y-scroll from-indigo-50 via-white to-purple-50 p-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">ქვიზის შედეგი</h1>
                        <p className="text-gray-600">დეტალური შესრულების ანალიზი</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div
                            className={`p-6 rounded-xl border-2 ${getScoreBgColor(
                                parseFloat(attempt?.percentage)
                            )} backdrop-blur-sm`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">დაგროვებული ქულა</p>
                                    <p
                                        className={`text-3xl font-bold ${getScoreColor(
                                            attempt?.percentage
                                        )}`}
                                    >
                                        {attempt?.score}
                                    </p>
                                </div>
                                <Trophy
                                    className={`h-8 w-8 ${getScoreColor(attempt?.percentage)}`}
                                />
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
                                    <p className="text-2xl font-bold text-purple-600">
                                        {attempt?.time_taken}
                                    </p>
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

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('correct')}
                                className={`px-6 py-3 text-sm font-medium ${activeTab === 'correct'
                                        ? 'border-b-2 border-green-500 text-green-600 bg-green-50'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                სწორი პასუხები ({correctQuestions?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('incorrect')}
                                className={`px-6 py-3 text-sm font-medium ${activeTab === 'incorrect'
                                        ? 'border-b-2 border-red-500 text-red-600 bg-red-50'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                არასწორი პასუხები ({incorrectQuestions?.length || 0})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 space-y-6">
                            {activeTab === 'correct' &&
                                correctQuestions?.map((item, idx) => (
                                    <div key={idx} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">შეკითხვა {item.order}</span>
                                            <span className="text-sm text-gray-500">
                                                დრო: {item.user_answer?.time_taken}s
                                            </span>
                                        </div>
                                    </div>
                                ))}

                            {activeTab === 'incorrect' &&
                                incorrectQuestions?.map((item, idx) => (
                                    <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">შეკითხვა {item.order}</span>
                                            <span className="text-sm text-gray-500">
                                                დრო: {item.user_answer?.time_taken}s
                                            </span>
                                        </div>

                                        {/* Correct answers */}
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-gray-700">სწორი პასუხი:</p>
                                            <CkeditorContentViewer html={item.answer ?? ''} />
                                        </div>

                                        {/* Explanation */}
                                        {item.explanation && (
                                            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <h5 className="font-medium text-yellow-800 mb-1">განმარტება</h5>
                                                <CkeditorContentViewer html={item.explanation} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 text-center space-x-4">
                        <button
                            onClick={() => navigate('/categories')}
                            className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            კატეგორიები
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default QuizResultPage;
