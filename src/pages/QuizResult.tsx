import { useEffect, useState } from 'react';
import { Clock, Trophy, Target, Calendar, Timer, Loader, ChevronDown, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import CkeditorContentViewer from '../components/CkEditorContentViewer';
import { useAttemptStore } from '../stores/attemptStore';
import { Question } from '../types/types';
import PDFViewer from '../components/PdfViewer';
import { apiV4 } from '../utils/axios';

interface QuizAIFeedback {
    performance_summary: string;
    strengths: string[];
    areas_to_improve: string[];
    study_recommendations: string[];
    motivational_message: string;
    next_steps: string;
}

const QuizResultPage = () => {
    const { attemptId } = useParams();
    const [activeTab, setActiveTab] = useState<'correct' | 'incorrect'>('correct');
    const [expanded, setExpanded] = useState<number | null>(null);
    const { attempt, fetchResult, loading } = useAttemptStore();

    const [aiFeedback, setAiFeedback]   = useState<QuizAIFeedback | null>(null);
    const [aiLoading, setAiLoading]     = useState(false);
    const [aiError, setAiError]         = useState(false);
    const [aiVisible, setAiVisible]     = useState(false);

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

    const handleGetAIFeedback = async () => {
        if (!attempt || aiLoading) return;
        setAiLoading(true);
        setAiError(false);
        setAiVisible(true);

        try {
            const res = await apiV4.post('/ai/evaluate-quiz/', {
                score: attempt.score,
                total_questions: attempt.total_questions,
                correct_answers: attempt.correct_answers,
                percentage: attempt.percentage,
                time_taken: attempt.time_taken ?? 0,
                quiz_title: `ქვიზი #${attempt.quiz}`,
            });
            setAiFeedback(res.data);
        } catch {
            setAiError(true);
        } finally {
            setAiLoading(false);
        }
    };

    if (loading) return <Loader />;

    const correctQuestions   = attempt?.questions?.filter((q: Question) => q.user_answer?.is_correct);
    const incorrectQuestions = attempt?.questions?.filter((q: Question) => !q.user_answer?.is_correct);

    const toggleAccordion = (id: number) => {
        setExpanded(prev => (prev === id ? null : id));
    };

    return (
        attempt && (
            <div className="bg-gradient-to-br h-dvh overflow-y-scroll from-indigo-50 via-white to-purple-50 p-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">ქვიზის შედეგი</h1>
                        <p className="text-gray-600">დეტალური შესრულების ანალიზი</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div
                            className={`p-6 rounded-xl border-2 ${getScoreBgColor(
                                parseFloat(attempt?.percentage)
                            )} backdrop-blur-sm`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="plain-text font-medium text-gray-600">დაგროვებული ქულა</p>
                                    <p
                                        className={`title font-bold ${getScoreColor(
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
                                    <p className="plain-text font-medium text-gray-600">სწორი პასუხები</p>
                                    <p className="title font-bold text-blue-600">
                                        {attempt?.correct_answers}/{attempt?.total_questions}
                                    </p>
                                </div>
                                <Target className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-purple-100 border-2 border-purple-200 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="plain-text font-medium text-gray-600">დახარჯული დრო</p>
                                    <p className="title font-bold text-purple-600">
                                        {attempt?.time_taken}
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-gray-100 border-2 border-gray-200 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="plain-text font-medium text-gray-600">ქუიზის ID</p>
                                    <p className="title font-bold text-gray-600">#{attempt?.id}</p>
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
                                    <p className="plain-text text-gray-600">დაწყების თარიღი</p>
                                    <p className="font-medium">{formatDate(attempt?.started_at)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div>
                                    <p className="plain-text text-gray-600">დასრულების თარიღი</p>
                                    <p className="font-medium">{formatDate(attempt?.completed_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis Button */}
                    {!aiVisible && (
                        <div className="mb-8 flex justify-center">
                            <button
                                onClick={handleGetAIFeedback}
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold plain-text shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                            >
                                <Sparkles className="h-5 w-5" />
                                AI ანალიზი და რჩევები
                            </button>
                        </div>
                    )}

                    {/* AI Feedback Panel */}
                    {aiVisible && (
                        <div className="mb-8 bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
                                <Sparkles className="h-5 w-5 text-white" />
                                <h3 className="text-white font-bold plain-text">AI ანალიზი და რჩევები</h3>
                            </div>

                            {aiLoading && (
                                <div className="flex flex-col items-center gap-3 py-12">
                                    <div className="w-8 h-8 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin" />
                                    <p className="plain-text text-gray-500">AI აანალიზებს შედეგებს...</p>
                                </div>
                            )}

                            {aiError && (
                                <div className="flex items-center justify-between px-6 py-4 bg-red-50">
                                    <p className="plain-text text-red-600">AI ანალიზი ვერ მოხერხდა.</p>
                                    <button
                                        onClick={handleGetAIFeedback}
                                        className="plain-text text-sm text-red-600 underline"
                                    >
                                        კვლავ ცდა
                                    </button>
                                </div>
                            )}

                            {aiFeedback && !aiLoading && (
                                <div className="p-6 flex flex-col gap-5">
                                    {/* Summary + Motivation */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                                            <h4 className="plain-text font-bold text-indigo-700 mb-2">შეჯამება</h4>
                                            <p className="plain-text text-indigo-900 leading-relaxed">{aiFeedback.performance_summary}</p>
                                        </div>
                                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                                            <h4 className="plain-text font-bold text-purple-700 mb-2">მოტივაცია</h4>
                                            <p className="plain-text text-purple-900 leading-relaxed">{aiFeedback.motivational_message}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Strengths */}
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                                            <h4 className="plain-text font-bold text-green-700 mb-3 flex items-center gap-2">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                                ძლიერი მხარეები
                                            </h4>
                                            <ul className="flex flex-col gap-2">
                                                {aiFeedback.strengths.map((s, i) => (
                                                    <li key={i} className="plain-text text-green-800 flex items-start gap-2">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Areas to improve */}
                                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                                            <h4 className="plain-text font-bold text-orange-700 mb-3 flex items-center gap-2">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                                გასაუმჯობესებელი სფეროები
                                            </h4>
                                            <ul className="flex flex-col gap-2">
                                                {aiFeedback.areas_to_improve.map((s, i) => (
                                                    <li key={i} className="plain-text text-orange-800 flex items-start gap-2">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Study recommendations */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                        <h4 className="plain-text font-bold text-blue-700 mb-3">სასწავლო რჩევები</h4>
                                        <ul className="flex flex-col gap-2">
                                            {aiFeedback.study_recommendations.map((s, i) => (
                                                <li key={i} className="plain-text text-blue-800 flex items-start gap-2">
                                                    <span className="plain-text font-bold text-blue-500 shrink-0">{i + 1}.</span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Next steps */}
                                    <div className="bg-gray-900 rounded-xl p-5">
                                        <h4 className="plain-text font-bold text-indigo-400 mb-2">შემდეგი ნაბიჯები</h4>
                                        <p className="plain-text text-gray-300 leading-relaxed">{aiFeedback.next_steps}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('correct')}
                                className={`px-6 py-3 plain-text font-medium ${activeTab === 'correct'
                                    ? 'border-b-2 border-green-500 text-green-600 bg-green-50'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                სწორი პასუხები ({correctQuestions?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('incorrect')}
                                className={`px-6 py-3 plain-text font-medium ${activeTab === 'incorrect'
                                    ? 'border-b-2 border-red-500 text-red-600 bg-red-50'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                არასწორი პასუხები ({incorrectQuestions?.length || 0})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 space-y-4">
                            {(activeTab === 'correct' ? correctQuestions : incorrectQuestions)?.map((item, idx) => {
                                const isOpen = expanded === item.order;
                                return (
                                    <div
                                        key={idx}
                                        className={`border rounded-lg ${item.user_answer?.is_correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => toggleAccordion(item.order)}>
                                            <div>
                                                <span className="font-medium">შეკითხვა {item.order}</span>
                                                <span className="ml-4 plain-text text-gray-500">
                                                    დრო: {item.user_answer?.time_taken}s
                                                </span>
                                                <span className="ml-4 plain-text text-dark-color">
                                                    სწორი პასუხი: {item.answer}
                                                </span>
                                            </div>
                                            <span className="flex items-center plain-text text-main-color">
                                                დეტალურად
                                                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                            </span>
                                        </div>

                                        {isOpen && (
                                            <div className="p-4 space-y-4 border-t bg-white">
                                                {!item.user_answer?.is_correct && (
                                                    <div>
                                                        <p className="plain-text font-medium text-gray-700">სწორი პასუხი:</p>
                                                        <CkeditorContentViewer html={item.answer ?? ''} />
                                                    </div>
                                                )}

                                                {!item.user_answer?.is_correct && attempt.quiz_explanation && (
                                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <h5 className="font-medium text-yellow-800 mb-1">განმარტება</h5>
                                                        <PDFViewer fileUrl={attempt.quiz_explanation} page={item.order} />
                                                    </div>
                                                )}

                                                <div className="mt-4">
                                                    <PDFViewer fileUrl={attempt.quiz_file!} page={item.order} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default QuizResultPage;
