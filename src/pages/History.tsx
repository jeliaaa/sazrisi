import { useEffect, useState } from 'react';
import { Sparkles, ChevronDown, Loader, Clock } from 'lucide-react';
import { useImitatedStore } from '../stores/imitatedStore';
import { AISummary } from '../types/types';
import ReactMarkdown from 'react-markdown';

const History = () => {
    const { aiSummaries, fetchAISummaryHistory, loading } = useImitatedStore();
    const [openId, setOpenId] = useState<number | null>(null);

    useEffect(() => {
        fetchAISummaryHistory();
    }, [fetchAISummaryHistory]);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('ka-GE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <Loader className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 overflow-y-auto">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="h-7 w-7 text-purple-600" />
                        <h1 className="text-3xl font-bold text-gray-800">AI სარეზერვო ისტორია</h1>
                    </div>
                    <p className="text-gray-500 plain-text">გამოცდის შემდეგ გენერირებული სასწავლო გეგმები</p>
                </div>

                {aiSummaries.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow p-12 text-center">
                        <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">AI სარეზერვო ჩანაწერები არ მოიძებნა.</p>
                        <p className="text-gray-400 plain-text mt-1">
                            შედეგის გვერდზე დააჭირე "GET AI SUMMARY"-ს, რომ ჩანაწერი შეიქმნას.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {aiSummaries.map((summary: AISummary) => {
                            const isOpen = openId === summary.id;
                            return (
                                <div
                                    key={summary.id}
                                    className="bg-white rounded-xl border border-purple-100 shadow overflow-hidden"
                                >
                                    {/* Card header */}
                                    <button
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-purple-50 transition-colors"
                                        onClick={() => setOpenId(prev => prev === summary.id ? null : summary.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                                                <Sparkles className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{summary.quiz_title}</p>
                                                <p className="plain-text text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(summary.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronDown
                                            className={`h-5 w-5 text-purple-400 transition-transform shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Card body */}
                                    {isOpen && (
                                        <div className="border-t border-purple-100 p-6 bg-purple-50/30">
                                            <div className="prose prose-sm max-w-none text-gray-800">
                                                <ReactMarkdown>{summary.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
