import { MoveDiagonal2 } from "lucide-react";
import { SetStateAction, Dispatch, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { IAttempt, Question, QuestionWithAnswers } from "../types/types";
import { useAttemptStore } from "../stores/attemptStore";
import { Link } from "react-router-dom";
import Loader from "./reusables/Loader";

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
    const allAnswered = useMemo(() => {
        return questions.length > 0 && questions.every(q =>
            'user_answer' in q && q.user_answer?.selected_answer
        );
    }, [questions]);


    // Answer states
    const [answersNoTime, setAnswersNoTime] = useState<(string | null)[]>([]);
    const [answersTimed, setAnswersTimed] = useState<(string | null)[]>([]);

    // Current question and timing
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
    const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());
    const [elapsedTimes, setElapsedTimes] = useState<Map<number, number>>(new Map());

    const { answerLoading, answerQuestion } = useAttemptStore();

    // Modal position and size
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [size, setSize] = useState({ width: 600, height: 600 });

    // Drag and resize states
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    // Refs for drag/resize calculations
    const dragStart = useRef<{ mouseX: number; mouseY: number; divX: number; divY: number } | null>(null);
    const resizeStart = useRef<{ mouseX: number; mouseY: number; width: number; height: number } | null>(null);
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

    // Memoized mouse move handler to prevent recreation on every render
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging && dragStart.current) {
            const dx = e.clientX - dragStart.current.mouseX;
            const dy = e.clientY - dragStart.current.mouseY;

            const newX = Math.min(
                Math.max(0, dragStart.current.divX + dx),
                window.innerWidth - size.width
            );
            const newY = Math.min(
                Math.max(0, dragStart.current.divY + dy),
                window.innerHeight - size.height
            );

            setPosition({ x: newX, y: newY });
        } else if (isResizing && resizeStart.current) {
            const dx = e.clientX - resizeStart.current.mouseX;
            const dy = e.clientY - resizeStart.current.mouseY;

            const newWidth = Math.min(
                Math.max(300, resizeStart.current.width + dx),
                window.innerWidth - position.x
            );
            const newHeight = Math.min(
                Math.max(200, resizeStart.current.height + dy),
                window.innerHeight - position.y
            );

            setSize({ width: newWidth, height: newHeight });
        }
    }, [isDragging, isResizing, position.x, position.y, size.height, size.width]);

    // Memoized mouse up handler
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        dragStart.current = null;
        resizeStart.current = null;
    }, []);

    // Event listeners management
    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

    // Event handlers
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).dataset.resizeHandle) return;
        e.preventDefault();
        dragStart.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            divX: position.x,
            divY: position.y
        };
        setIsDragging(true);
    }, [position]);

    const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        resizeStart.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            width: size.width,
            height: size.height
        };
        setIsResizing(true);
    }, [size]);

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
                className="fixed inset-0 bg-black/10 bg-opacity-40 z-200"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            {answerLoading ? <Loader /> :
                <div
                    ref={modalRef}
                    className={`z-[300] fixed bg-white p-4 overflow-auto shadow-lg rounded-md 
    ${window.innerWidth < 1024 ? "left-1/2 -translate-x-1/2 bottom-0 cursor-default" : "cursor-move"}`}
                    style={{
                        top: window.innerWidth < 1024 ? "auto" : position.y,
                        left: window.innerWidth < 1024 ? "50%" : position.x,
                        width: window.innerWidth < 1024 ? "100%" : size.width,
                        height: window.innerWidth < 1024 ? "60%" : size.height,
                        userSelect: isDragging || isResizing ? "none" : "auto",
                    }}
                    onMouseDown={handleMouseDown}
                    onClick={stopPropagation}
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
                                    disabled={answerLoading}
                                >
                                    {answerLoading ? "Submitting..." : "Submit"}
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
                                            className={`inline-block px-3 py-1 mx-1 bg-gray-300 rounded-sm transition-colors ${currentQuestionIndex === index
                                                ? "border-2" : "border-0"} `}
                                            onMouseDown={stopPropagation}
                                            title={hasSelectedAnswer ? `Answered: ${q.user_answer?.selected_answer?.toUpperCase()}` : "Not answered"}
                                        >
                                            {q.order}
                                        </button>
                                    );
                                })}
                                {allAnswered && <Link
                                    to={`/quiz/result/${attempt?.id}`}
                                    className={`inline-block px-3 py-1 mx-1 rounded-sm transition-colors border-2`}
                                    onMouseDown={stopPropagation}
                                >
                                    დასრულება
                                </Link>}
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
                                    // const correctAnswer = currentQuestion?.answer;

                                    const isSelected = selectedAnswer === choice;
                                    // const isCorrect = correctAnswer === choice;
                                    const isDisabled = isQuestionAnswered;

                                    return (
                                        <label
                                            key={choice}
                                            className={`flex items-center gap-2 border p-2 rounded cursor-pointer transition-colors
                                                    ${isSelected
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
                                    disabled={answerLoading || isQuestionAnswered}
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
                                    disabled={answerLoading || isQuestionAnswered}
                                >
                                    {answerLoading ? "ატვირთვა..." : isQuestionAnswered ? "უკვე შესრულებულია" : "შესრულება"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Resize Handle */}
                    <div
                        data-resize-handle="true"
                        onMouseDown={handleResizeMouseDown}
                        className="w-8 h-8 bg-gray-100 flex items-center justify-center absolute top-1 left-1 cursor-se-resize rounded hover:bg-gray-200 transition-colors"
                        title="Resize"
                    >
                        <MoveDiagonal2 size={16} />
                    </div>
                </div>}
        </>
    );
};

export default AnswerModal;