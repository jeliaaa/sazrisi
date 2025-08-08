import { SetStateAction, Dispatch, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { IAttempt, Question, QuestionWithAnswers } from "../types/types";
import { useAttemptStore } from "../stores/attemptStore";
import { Rnd } from "react-rnd";

interface AnswerModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isTraining: boolean;
    attempt: IAttempt | null | undefined;
    questions: Question[] | QuestionWithAnswers[] | [];
}

const AnswerModal = ({ isOpen, setIsOpen, isTraining, attempt, questions }: AnswerModalProps) => {
    // Tab state - memoized to prevent unnecessary re-renders
    const activeTab = useMemo(() => isTraining ? "no-time" : "timed", [isTraining]);

    // Answer states
    const [answersNoTime, setAnswersNoTime] = useState<(string | null)[]>([]);
    const [answersTimed, setAnswersTimed] = useState<(string | null)[]>([]);

    // Current question and timing
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
    const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());
    const [elapsedTimes, setElapsedTimes] = useState<Map<number, number>>(new Map());

    const { loading, answerQuestion } = useAttemptStore();

    // Modal position and size state for react-rnd
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [size, setSize] = useState({ width: 600, height: 400 });

    // Ref for modal content (not used for dragging/resizing now)
    const modalRef = useRef<HTMLDivElement>(null);

    // Memoized current question to prevent unnecessary recalculations
    const currentQuestion = useMemo(() => {
        return questions[currentQuestionIndex] || null;
    }, [questions, currentQuestionIndex]);

    // Check if current question has been answered (has selected_answer property)
    const isQuestionAnswered = useMemo(() => {
        return !!(currentQuestion && 'user_answer' in currentQuestion && currentQuestion.user_answer?.selected_answer);
    }, [currentQuestion]);

    // Initialize answer arrays when attempt changes
    useEffect(() => {
        if (attempt?.total_questions) {
            const initialAnswers = Array(attempt.total_questions).fill(null);
            setAnswersNoTime(initialAnswers);
            setAnswersTimed(initialAnswers);
        }
    }, [attempt?.total_questions]);

    // Initialize timing for timed mode
    useEffect(() => {
        if (attempt && !isTraining && isOpen) {
            setQuestionStartTime(Date.now());
        }
    }, [attempt, isTraining, isOpen]);

    // Reset current question when questions change
    useEffect(() => {
        if (questions.length > 0) {
            setCurrentQuestionIndex(0);
        }
    }, [questions]);

    const handleQuestionSwitch = useCallback((newIndex: number) => {
        if (newIndex < 0 || newIndex >= questions.length) return;

        // Save current question time only if it's not already answered
        if (questionStartTime !== null && currentQuestion && !isQuestionAnswered) {
            const now = Date.now();
            const timeSpent = Math.floor((now - questionStartTime) / 1000);

            setElapsedTimes(prev => {
                const updated = new Map(prev);
                updated.set(currentQuestion.order, (updated.get(currentQuestion.order) || 0) + timeSpent);
                return updated;
            });
        }

        setCurrentQuestionIndex(newIndex);

        // Set timer for new question only if it hasn't been answered
        const newQuestion = questions[newIndex];
        const hasSelectedAnswer = newQuestion && 'answer' in newQuestion && newQuestion.user_answer?.selected_answer;

        if (newQuestion && !hasSelectedAnswer && !submittedQuestions.has(newQuestion.order)) {
            setQuestionStartTime(Date.now());
        } else {
            setQuestionStartTime(null);
        }
    }, [questions, questionStartTime, currentQuestion, submittedQuestions, isQuestionAnswered]);

    const handleNoTimeAnswer = useCallback((questionIndex: number, choice: string) => {
        setAnswersNoTime(prev => {
            const updated = [...prev];
            updated[questionIndex] = choice;
            return updated;
        });
    }, []);

    const handleTimedAnswer = useCallback((choice: string) => {
        if (!currentQuestion || isQuestionAnswered) return;

        setAnswersTimed(prev => {
            const updated = [...prev];
            updated[currentQuestion.order] = choice;
            return updated;
        });
    }, [currentQuestion, isQuestionAnswered]);

    const handleTimedComplete = useCallback(async () => {
        if (!currentQuestion || !attempt || isQuestionAnswered) return;

        const selectedAnswer = answersTimed[currentQuestion.order];
        if (!selectedAnswer) {
            alert("Please select an answer before completing.");
            return;
        }

        if (submittedQuestions.has(currentQuestion.order)) {
            alert("You have already completed this question.");
            return;
        }

        const now = Date.now();
        const timeSpentNow = questionStartTime ? Math.floor((now - questionStartTime) / 1000) : 0;
        const totalTime = (elapsedTimes.get(currentQuestion.order) || 0) + timeSpentNow;

        const answerPayload = {
            question_id: currentQuestion.id,
            selected_answer: selectedAnswer,
            time_taken: totalTime,
        };

        try {
            await answerQuestion(attempt.id.toString(), answerPayload);

            setSubmittedQuestions(prev => new Set(prev).add(currentQuestion.order));
            setElapsedTimes(prev => {
                const updated = new Map(prev);
                updated.set(currentQuestion.order, totalTime);
                return updated;
            });
            setQuestionStartTime(null);

            // Move to next unanswered question
            const nextUnansweredIndex = questions.findIndex((q, index) => {
                const hasSelectedAnswer = 'answer' in q && q.user_answer?.selected_answer;
                return index > currentQuestionIndex && !hasSelectedAnswer && !submittedQuestions.has(q.order);
            });

            if (nextUnansweredIndex !== -1) {
                handleQuestionSwitch(nextUnansweredIndex);
            }
        } catch (error) {
            console.error("Failed to submit answer:", error);
            alert("Failed to submit answer. Please try again.");
        }
    }, [currentQuestion, attempt, answersTimed, submittedQuestions, questionStartTime, elapsedTimes, answerQuestion, questions, currentQuestionIndex, handleQuestionSwitch, isQuestionAnswered]);

    const handleSkip = useCallback(() => {
        if (!currentQuestion || isQuestionAnswered) return;

        // Save elapsed time without submitting
        if (questionStartTime !== null) {
            const now = Date.now();
            const timeSpent = Math.floor((now - questionStartTime) / 1000);

            setElapsedTimes(prev => {
                const updated = new Map(prev);
                updated.set(currentQuestion.order, (updated.get(currentQuestion.order) || 0) + timeSpent);
                return updated;
            });
            setQuestionStartTime(null);
        }

        // Move to next question
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            handleQuestionSwitch(nextIndex);
        }
    }, [currentQuestion, questionStartTime, currentQuestionIndex, questions.length, handleQuestionSwitch, isQuestionAnswered]);

    const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/10 bg-opacity-40 z-40"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal wrapped with Rnd for drag & resize */}
            <Rnd
                size={{ width: size.width, height: size.height }}
                position={{ x: position.x, y: position.y }}
                onDragStop={(_, d) => setPosition({ x: d.x, y: d.y })}
                onResizeStop={(_, __, ref, delta, position) => {
                    setSize({
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                    });
                    setPosition(position);
                }}
                bounds="window"
                minWidth={300}
                minHeight={200}
                enableResizing={{
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                }}
                className="z-50 lg:cursor-move"
            >
                <div
                    ref={modalRef}
                    className={`bg-white p-4 overflow-auto shadow-lg rounded-t-md w-full h-full cursor-default lg:rounded-md`}
                    onMouseDown={window.innerWidth >= 1024 ? (e) => e.stopPropagation() : undefined}
                    onClick={stopPropagation}
                    style={{
                        userSelect: "auto",
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-2 right-2 text-xl font-bold cursor-pointer z-10 hover:text-red-500"
                        aria-label="Close Modal"
                        onMouseDown={stopPropagation}
                    >
                        ×
                    </button>

                    {/* Header */}
                    <div className="flex flex-wrap gap-4 mb-4 justify-center select-none">
                        <h2 className="text-lg font-semibold">პასუხების ფურცელი</h2>
                    </div>

                    {/* No Time Tab */}
                    {activeTab === "no-time" && (
                        <div className="overflow-auto max-h-[70vh]">
                            <table className="w-full text-sm sm:text-base table-fixed border">
                                <thead>
                                    <tr>
                                        <th className="border px-1 py-1 w-8 sm:w-10">#</th>
                                        {["ა", "ბ", "გ", "დ"].map((choice) => (
                                            <th key={choice} className="border px-1 py-1">
                                                {choice}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((_, i) => (
                                        <tr key={i}>
                                            <td className="border text-center">{i + 1}</td>
                                            {["ა", "ბ", "გ", "დ"].map((choice) => (
                                                <td key={choice} className="border text-center">
                                                    <input
                                                        type="radio"
                                                        name={`noTime-${i}`}
                                                        value={choice}
                                                        checked={answersNoTime[i] === choice}
                                                        onChange={() => handleNoTimeAnswer(i, choice)}
                                                        className="mx-auto"
                                                        onMouseDown={stopPropagation}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 text-right">
                                <button
                                    onClick={() => alert("Submit clicked (implement your logic)")}
                                    className="border px-6 py-2 hover:bg-gray-100 rounded"
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Timed Tab */}
                    {activeTab === "timed" && (
                        <div className="flex flex-col gap-4">
                            {/* Question Navigation */}
                            <div className="overflow-x-auto whitespace-nowrap border-b py-2">
                                {questions.map((q, index) => {
                                    const hasSelectedAnswer = 'answer' in q && q.user_answer?.selected_answer;
                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => handleQuestionSwitch(index)}
                                            className={`inline-block px-3 py-1 mx-1 rounded-sm transition-colors ${currentQuestionIndex === index
                                                ? "border-2"
                                                : ""}  ${q.user_answer?.is_correct
                                                    ? "bg-green-400"
                                                    : "bg-red-400"
                                                }`}
                                            onMouseDown={stopPropagation}
                                            title={hasSelectedAnswer ? `Answered: ${q.user_answer?.selected_answer?.toUpperCase()}` : "Not answered"}
                                        >
                                            {q.order}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Question Info */}
                            <div className="text-center text-base font-semibold">
                                კითხვა {currentQuestion?.order} / {questions.length}
                                {isQuestionAnswered && (
                                    <div className="mt-1">
                                        <span className="text-main-color title">შესრულებულია</span>
                                        {currentQuestion && 'answer' in currentQuestion && currentQuestion.user_answer && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                თქვენი პასუხი: <strong>{currentQuestion.user_answer.selected_answer.toUpperCase()}</strong>
                                                {currentQuestion.user_answer.is_correct !== undefined && (
                                                    <span className={`ml-2 font-bold ${currentQuestion.user_answer.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                                                        ({currentQuestion.user_answer.is_correct ? 'სწორია' : 'არასწორია'})
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Answer Options */}
                            <div className="grid grid-cols-2 gap-4 justify-center max-w-sm mx-auto">
                                {["a", "b", "g", "d"].map((choice, index) => {
                                    const georgianChoices = ["ა", "ბ", "გ", "დ"];

                                    const selectedAnswer = currentQuestion?.user_answer?.selected_answer ?? answersTimed[currentQuestion?.order];
                                    const correctAnswer = currentQuestion?.answer;

                                    const isSelected = selectedAnswer === choice;
                                    const isCorrect = correctAnswer === choice;
                                    const isDisabled = isQuestionAnswered;

                                    return (
                                        <label
                                            key={choice}
                                            className={`flex items-center gap-2 border p-2 rounded cursor-pointer transition-colors
          ${isCorrect
                                                    ? "bg-green-100 border-green-300"
                                                    : isSelected
                                                        ? "bg-main-color/10 border-main-color"
                                                        : "hover:bg-gray-50"
                                                }
          ${isDisabled ? "cursor-not-allowed" : ""}
        `}
                                            onMouseDown={stopPropagation}
                                        >
                                            <input
                                                type="radio"
                                                name="timedAnswer"
                                                value={choice}
                                                checked={isSelected}
                                                onChange={() => !isDisabled && handleTimedAnswer(choice)}
                                                disabled={isDisabled}
                                            />
                                            <span className={`${isSelected ? "text-main-color font-bold" : ""}`}>
                                                {georgianChoices[index]}
                                            </span>
                                            {isSelected && isDisabled && (
                                                <span className="ml-auto text-main-color">✓</span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    onClick={handleSkip}
                                    className="border px-6 py-2 rounded hover:bg-gray-100 transition-colors"
                                    type="button"
                                    disabled={loading || isQuestionAnswered}
                                >
                                    გამოტოვება
                                </button>
                                <button
                                    onClick={handleTimedComplete}
                                    className={`border px-6 py-2 rounded transition-colors ${isQuestionAnswered
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                    type="button"
                                    disabled={loading || isQuestionAnswered}
                                >
                                    {loading ? "ატვირთვა..." : isQuestionAnswered ? "უკვე შესრულებულია" : "შესრულება"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Rnd>
        </>
    );
};

export default AnswerModal;
