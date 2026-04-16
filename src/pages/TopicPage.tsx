import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, ExternalLink, ChevronDown, ArrowLeft, Loader } from 'lucide-react';
import { useImitatedStore } from '../stores/imitatedStore';
import { ImitationTopic, TopicAIInsights } from '../types/types';

const TopicPage = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();

    const { fetchTopic, fetchTopicAIInsights } = useImitatedStore();

    const [topic, setTopic] = useState<ImitationTopic | null>(null);
    const [topicLoading, setTopicLoading] = useState(true);
    const [topicError, setTopicError] = useState(false);

    const [insights, setInsights] = useState<TopicAIInsights | null>(null);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [insightsError, setInsightsError] = useState('');
    const [openExample, setOpenExample] = useState<number | null>(null);

    useEffect(() => {
        if (!topicId) return;
        setTopicLoading(true);
        fetchTopic(Number(topicId)).then((data) => {
            if (data) {
                setTopic(data);
            } else {
                setTopicError(true);
            }
            setTopicLoading(false);
        });
    }, [topicId, fetchTopic]);

    const handleGetInsights = async () => {
        if (!topicId) return;
        setInsightsLoading(true);
        setInsightsError('');
        const data = await fetchTopicAIInsights(Number(topicId));
        if (data) {
            setInsights(data);
        } else {
            setInsightsError('AI-ს პასუხი ვერ მოვიღეთ. სცადეთ თავიდან.');
        }
        setInsightsLoading(false);
    };

    if (topicLoading) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <Loader className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (topicError || !topic) {
        return (
            <div className="flex flex-col items-center justify-center h-dvh gap-4">
                <p className="text-red-600 font-medium">ამ თემაზე წვდომა არ გაქვს.</p>
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-indigo-600 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> უკან
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 overflow-y-auto">
            <div className="max-w-3xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-indigo-600 hover:underline mb-6 plain-text"
                >
                    <ArrowLeft className="h-4 w-4" /> უკან
                </button>

                {/* Topic header */}
                <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-8 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-100 rounded-xl shrink-0">
                            <BookOpen className="h-7 w-7 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-3">{topic.name}</h1>
                            <p className="text-gray-600 leading-relaxed">{topic.description}</p>
                        </div>
                    </div>
                </div>

                {/* AI Insights button */}
                {!insights && (
                    <button
                        onClick={handleGetInsights}
                        disabled={insightsLoading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-60 mb-6"
                    >
                        <Sparkles className="h-5 w-5" />
                        {insightsLoading ? 'AI ინფორმაცია იტვირთება...' : 'GET AI INSIGHTS'}
                    </button>
                )}

                {insightsLoading && (
                    <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
                        <Loader className="h-6 w-6 animate-spin text-indigo-500" />
                        <span>მუშავდება...</span>
                    </div>
                )}

                {insightsError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4">
                        {insightsError}
                    </div>
                )}

                {insights && (
                    <div className="space-y-6">

                        {/* Overall info */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                ზოგადი ინფორმაცია
                            </h2>
                            <p className="text-gray-700 leading-relaxed">{insights.overall_info}</p>
                        </div>

                        {/* Detailed info */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                დეტალური ახსნა
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{insights.detailed_info}</p>
                        </div>

                        {/* Examples */}
                        {insights.examples?.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                    მაგალითები
                                </h2>
                                <div className="space-y-3">
                                    {insights.examples.map((ex, i) => (
                                        <div key={i} className="border border-green-100 rounded-lg overflow-hidden">
                                            <button
                                                className="w-full flex items-center justify-between p-4 text-left bg-green-50 hover:bg-green-100 transition-colors"
                                                onClick={() => setOpenExample(prev => prev === i ? null : i)}
                                            >
                                                <span className="font-medium text-gray-800">მაგალითი {i + 1}: {ex.task}</span>
                                                <ChevronDown className={`h-4 w-4 text-green-600 transition-transform ${openExample === i ? 'rotate-180' : ''}`} />
                                            </button>
                                            {openExample === i && (
                                                <div className="p-4 bg-white border-t border-green-100">
                                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{ex.solution}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Useful links */}
                        {insights.useful_links?.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                    სასარგებლო ბმულები
                                </h2>
                                <ul className="space-y-2">
                                    {insights.useful_links.map((link, i) => (
                                        <li key={i}>
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-indigo-600 hover:underline plain-text"
                                            >
                                                <ExternalLink className="h-4 w-4 shrink-0" />
                                                {link.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Re-fetch button */}
                        <button
                            onClick={handleGetInsights}
                            disabled={insightsLoading}
                            className="flex items-center gap-2 px-4 py-2 border border-indigo-300 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors plain-text disabled:opacity-60"
                        >
                            <Sparkles className="h-4 w-4" />
                            ახლიდან გენერირება
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopicPage;
