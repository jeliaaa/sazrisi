// import { MoveDiagonal2 } from "lucide-react";
// import { SetStateAction, Dispatch, useState, useRef, useEffect, useCallback, useMemo } from "react";
// import { IAttempt, Question, QuestionWithAnswers } from "../types/types";
// import { useAttemptStore } from "../stores/attemptStore";
// import { Link } from "react-router-dom";
// import Loader from "./reusables/Loader";

// interface AnswerModalProps {
//     isOpen: boolean;
//     setIsOpen: Dispatch<SetStateAction<boolean>>;
//     isTraining: boolean;
//     attempt: IAttempt | null | undefined;
//     questions: Question[] | QuestionWithAnswers[] | [];
// }

// const AnswerModal = ({ isOpen, setIsOpen, isTraining, attempt, questions }: AnswerModalProps) => {
//     // Tab state - memoized to prevent unnecessary re-renders
//     const activeTab = useMemo(() => isTraining ? "no-time" : "timed", [isTraining]);
//     const allAnswered = useMemo(() => {
//         return questions.length > 0 && questions.every(q =>
//             'user_answer' in q && q.user_answer?.selected_answer
//         );
//     }, [questions]);


//     // Answer states
//     const [answersNoTime, setAnswersNoTime] = useState<(string | null)[]>([]);
//     const [answersTimed, setAnswersTimed] = useState<(string | null)[]>([]);

//     // Current question and timing
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
//     const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());
//     const [elapsedTimes, setElapsedTimes] = useState<Map<number, number>>(new Map());

//     const { answerLoading, answerQuestion } = useAttemptStore();

//     // Modal position and size
//     const [position, setPosition] = useState({ x: 100, y: 100 });
//     const [size, setSize] = useState({ width: 600, height: 600 });

//     // Drag and resize states
//     const [isDragging, setIsDragging] = useState(false);
//     const [isResizing, setIsResizing] = useState(false);

//     // Refs for drag/resize calculations
//     const dragStart = useRef<{ mouseX: number; mouseY: number; divX: number; divY: number } | null>(null);
//     const resizeStart = useRef<{ mouseX: number; mouseY: number; width: number; height: number } | null>(null);
//     const modalRef = useRef<HTMLDivElement>(null);

//     // Memoized current question to prevent unnecessary recalculations
//     const currentQuestion = useMemo(() => {
//         return questions[currentQuestionIndex] || null;
//     }, [questions, currentQuestionIndex]);

//     // Check if current question has been answered (has selected_answer property)
//     const isQuestionAnswered = useMemo(() => {
//         return !!(currentQuestion && 'user_answer' in currentQuestion && currentQuestion.user_answer?.selected_answer);
//     }, [currentQuestion]);

//     // Initialize answer arrays when attempt changes
//     useEffect(() => {
//         if (attempt?.total_questions) {
//             const initialAnswers = Array(attempt.total_questions).fill(null);
//             setAnswersNoTime(initialAnswers);
//             setAnswersTimed(initialAnswers);
//         }
//     }, [attempt?.total_questions]);

//     // Initialize timing for timed mode
//     useEffect(() => {
//         if (attempt && !isTraining && isOpen) {
//             setQuestionStartTime(Date.now());
//         }
//     }, [attempt, isTraining, isOpen]);

//     // Reset current question when questions change
//     useEffect(() => {
//         if (questions.length > 0) {
//             setCurrentQuestionIndex(0);
//         }
//     }, [questions]);

//     // Memoized mouse move handler to prevent recreation on every render
//     const handleMouseMove = useCallback((e: MouseEvent) => {
//         if (isDragging && dragStart.current) {
//             const dx = e.clientX - dragStart.current.mouseX;
//             const dy = e.clientY - dragStart.current.mouseY;

//             const newX = Math.min(
//                 Math.max(0, dragStart.current.divX + dx),
//                 window.innerWidth - size.width
//             );
//             const newY = Math.min(
//                 Math.max(0, dragStart.current.divY + dy),
//                 window.innerHeight - size.height
//             );

//             setPosition({ x: newX, y: newY });
//         } else if (isResizing && resizeStart.current) {
//             const dx = e.clientX - resizeStart.current.mouseX;
//             const dy = e.clientY - resizeStart.current.mouseY;

//             const newWidth = Math.min(
//                 Math.max(300, resizeStart.current.width + dx),
//                 window.innerWidth - position.x
//             );
//             const newHeight = Math.min(
//                 Math.max(200, resizeStart.current.height + dy),
//                 window.innerHeight - position.y
//             );

//             setSize({ width: newWidth, height: newHeight });
//         }
//     }, [isDragging, isResizing, position.x, position.y, size.height, size.width]);

//     // Memoized mouse up handler
//     const handleMouseUp = useCallback(() => {
//         setIsDragging(false);
//         setIsResizing(false);
//         dragStart.current = null;
//         resizeStart.current = null;
//     }, []);

//     // Event listeners management
//     useEffect(() => {
//         if (isDragging || isResizing) {
//             document.addEventListener("mousemove", handleMouseMove);
//             document.addEventListener("mouseup", handleMouseUp);

//             return () => {
//                 document.removeEventListener("mousemove", handleMouseMove);
//                 document.removeEventListener("mouseup", handleMouseUp);
//             };
//         }
//     }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

//     // Event handlers
//     const handleMouseDown = useCallback((e: React.MouseEvent) => {
//         if ((e.target as HTMLElement).dataset.resizeHandle) return;
//         e.preventDefault();
//         dragStart.current = {
//             mouseX: e.clientX,
//             mouseY: e.clientY,
//             divX: position.x,
//             divY: position.y
//         };
//         setIsDragging(true);
//     }, [position]);

//     const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
//         e.stopPropagation();
//         resizeStart.current = {
//             mouseX: e.clientX,
//             mouseY: e.clientY,
//             width: size.width,
//             height: size.height
//         };
//         setIsResizing(true);
//     }, [size]);

//     const handleQuestionSwitch = useCallback((newIndex: number) => {
//         if (newIndex < 0 || newIndex >= questions.length) return;

//         // Save current question time only if it's not already answered
//         if (questionStartTime !== null && currentQuestion && !isQuestionAnswered) {
//             const now = Date.now();
//             const timeSpent = Math.floor((now - questionStartTime) / 1000);

//             setElapsedTimes(prev => {
//                 const updated = new Map(prev);
//                 updated.set(currentQuestion.order, (updated.get(currentQuestion.order) || 0) + timeSpent);
//                 return updated;
//             });
//         }

//         setCurrentQuestionIndex(newIndex);

//         // Set timer for new question only if it hasn't been answered
//         const newQuestion = questions[newIndex];
//         const hasSelectedAnswer = newQuestion && 'answer' in newQuestion && newQuestion.user_answer?.selected_answer;

//         if (newQuestion && !hasSelectedAnswer && !submittedQuestions.has(newQuestion.order)) {
//             setQuestionStartTime(Date.now());
//         } else {
//             setQuestionStartTime(null);
//         }
//     }, [questions, questionStartTime, currentQuestion, submittedQuestions, isQuestionAnswered]);

//     const handleNoTimeAnswer = useCallback((questionIndex: number, choice: string) => {
//         setAnswersNoTime(prev => {
//             const updated = [...prev];
//             updated[questionIndex] = choice;
//             return updated;
//         });
//     }, []);

//     const handleTimedAnswer = useCallback((choice: string) => {
//         if (!currentQuestion || isQuestionAnswered) return;

//         setAnswersTimed(prev => {
//             const updated = [...prev];
//             updated[currentQuestion.order] = choice;
//             return updated;
//         });
//     }, [currentQuestion, isQuestionAnswered]);

//     const handleTimedComplete = useCallback(async () => {
//         if (!currentQuestion || !attempt || isQuestionAnswered) return;

//         const selectedAnswer = answersTimed[currentQuestion.order];
//         if (!selectedAnswer) {
//             alert("Please select an answer before completing.");
//             return;
//         }

//         if (submittedQuestions.has(currentQuestion.order)) {
//             alert("You have already completed this question.");
//             return;
//         }

//         const now = Date.now();
//         const timeSpentNow = questionStartTime ? Math.floor((now - questionStartTime) / 1000) : 0;
//         const totalTime = (elapsedTimes.get(currentQuestion.order) || 0) + timeSpentNow;

//         const answerPayload = {
//             question_id: currentQuestion.id,
//             selected_answer: selectedAnswer,
//             time_taken: totalTime,
//         };

//         try {
//             await answerQuestion(attempt.id.toString(), answerPayload);

//             setSubmittedQuestions(prev => new Set(prev).add(currentQuestion.order));
//             setElapsedTimes(prev => {
//                 const updated = new Map(prev);
//                 updated.set(currentQuestion.order, totalTime);
//                 return updated;
//             });
//             setQuestionStartTime(null);

//             // Move to next unanswered question
//             const nextUnansweredIndex = questions.findIndex((q, index) => {
//                 const hasSelectedAnswer = 'answer' in q && q.user_answer?.selected_answer;
//                 return index > currentQuestionIndex && !hasSelectedAnswer && !submittedQuestions.has(q.order);
//             });

//             if (nextUnansweredIndex !== -1) {
//                 handleQuestionSwitch(nextUnansweredIndex);
//             }
//         } catch (error) {
//             console.error("Failed to submit answer:", error);
//             alert("Failed to submit answer. Please try again.");
//         }
//     }, [currentQuestion, attempt, answersTimed, submittedQuestions, questionStartTime, elapsedTimes, answerQuestion, questions, currentQuestionIndex, handleQuestionSwitch, isQuestionAnswered]);

//     const handleSkip = useCallback(() => {
//         if (!currentQuestion || isQuestionAnswered) return;

//         // Save elapsed time without submitting
//         if (questionStartTime !== null) {
//             const now = Date.now();
//             const timeSpent = Math.floor((now - questionStartTime) / 1000);

//             setElapsedTimes(prev => {
//                 const updated = new Map(prev);
//                 updated.set(currentQuestion.order, (updated.get(currentQuestion.order) || 0) + timeSpent);
//                 return updated;
//             });
//             setQuestionStartTime(null);
//         }

//         // Move to next question
//         const nextIndex = currentQuestionIndex + 1;
//         if (nextIndex < questions.length) {
//             handleQuestionSwitch(nextIndex);
//         }
//     }, [currentQuestion, questionStartTime, currentQuestionIndex, questions.length, handleQuestionSwitch, isQuestionAnswered]);

//     const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

//     if (!isOpen) return null;

//     return (
//         <>
//             {/* Backdrop */}
//             <div
//                 className="fixed inset-0 bg-black/10 bg-opacity-40 z-200"
//                 onClick={() => setIsOpen(false)}
//             />

//             {/* Modal */}
//             {answerLoading ? <Loader /> :
//                 <div
//                     ref={modalRef}
//                     className={`z-[300] fixed bg-white p-4 overflow-auto shadow-lg rounded-md 
//     ${window.innerWidth < 1024 ? "left-1/2 -translate-x-1/2 bottom-0 cursor-default" : "cursor-move"}`}
//                     style={{
//                         top: window.innerWidth < 1024 ? "auto" : position.y,
//                         left: window.innerWidth < 1024 ? "50%" : position.x,
//                         width: window.innerWidth < 1024 ? "100%" : size.width,
//                         height: window.innerWidth < 1024 ? "60%" : size.height,
//                         userSelect: isDragging || isResizing ? "none" : "auto",
//                     }}
//                     onMouseDown={handleMouseDown}
//                     onClick={stopPropagation}
//                 >

//                     {/* Close Button */}
//                     <button
//                         onClick={() => setIsOpen(false)}
//                         className="absolute top-2 right-2 text-xl font-bold cursor-pointer z-10 hover:text-red-500"
//                         aria-label="Close Modal"
//                         onMouseDown={stopPropagation}
//                     >
//                         ×
//                     </button>

//                     {/* Header */}
//                     <div className="flex flex-wrap gap-4 mb-4 justify-center select-none">
//                         <h2 className="text-lg font-semibold">პასუხების ფურცელი</h2>
//                     </div>

//                     {/* No Time Tab */}
//                     {activeTab === "no-time" && (
//                         <div className="overflow-auto max-h-[70vh]">
//                             <table className="w-full text-sm sm:text-base table-fixed border">
//                                 <thead>
//                                     <tr>
//                                         <th className="border px-1 py-1 w-8 sm:w-10">#</th>
//                                         {["ა", "ბ", "გ", "დ"].map((choice) => (
//                                             <th key={choice} className="border px-1 py-1">
//                                                 {choice}
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {questions.map((_, i) => (
//                                         <tr key={i}>
//                                             <td className="border text-center">{i + 1}</td>
//                                             {["ა", "ბ", "გ", "დ"].map((choice) => (
//                                                 <td key={choice} className="border text-center">
//                                                     <input
//                                                         type="radio"
//                                                         name={`noTime-${i}`}
//                                                         value={choice}
//                                                         checked={answersNoTime[i] === choice}
//                                                         onChange={() => handleNoTimeAnswer(i, choice)}
//                                                         className="mx-auto"
//                                                         onMouseDown={stopPropagation}
//                                                     />
//                                                 </td>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <div className="mt-4 text-right">
//                                 <button
//                                     onClick={() => alert("Submit clicked (implement your logic)")}
//                                     className="border px-6 py-2 hover:bg-gray-100 rounded"
//                                     disabled={answerLoading}
//                                 >
//                                     {answerLoading ? "Submitting..." : "Submit"}
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {/* Timed Tab */}
//                     {activeTab === "timed" && (
//                         <div className="flex flex-col gap-4">
//                             {/* Question Navigation */}
//                             <div className="overflow-x-auto whitespace-nowrap border-b py-2">
//                                 {questions.map((q, index) => {
//                                     const hasSelectedAnswer = 'answer' in q && q.user_answer?.selected_answer;
//                                     return (
//                                         <button
//                                             key={q.id}
//                                             onClick={() => handleQuestionSwitch(index)}
//                                             className={`inline-block px-3 py-1 mx-1 bg-gray-300 rounded-sm transition-colors ${currentQuestionIndex === index
//                                                 ? "border-2" : "border-0"} `}
//                                             onMouseDown={stopPropagation}
//                                             title={hasSelectedAnswer ? `Answered: ${q.user_answer?.selected_answer?.toUpperCase()}` : "Not answered"}
//                                         >
//                                             {q.order}
//                                         </button>
//                                     );
//                                 })}
//                                 {allAnswered && <Link
//                                     to={`/quiz/result/${attempt?.id}`}
//                                     className={`inline-block px-3 py-1 mx-1 rounded-sm transition-colors border-2`}
//                                     onMouseDown={stopPropagation}
//                                 >
//                                     დასრულება
//                                 </Link>}
//                             </div>

//                             {/* Question Info */}
//                             <div className="text-center text-base font-semibold">
//                                 კითხვა {currentQuestion?.order} / {questions.length}
//                                 {isQuestionAnswered && (
//                                     <div className="mt-1">
//                                         <span className="text-main-color title">შესრულებულია</span>
//                                         {currentQuestion && 'answer' in currentQuestion && currentQuestion.user_answer && (
//                                             <div className="text-sm text-gray-600 mt-1">
//                                                 თქვენი პასუხი: <strong>{currentQuestion.user_answer.selected_answer.toUpperCase()}</strong>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Answer Options */}
//                             <div className="grid grid-cols-2 gap-4 justify-center max-w-sm mx-auto">
//                                 {["a", "b", "g", "d"].map((choice, index) => {
//                                     const georgianChoices = ["ა", "ბ", "გ", "დ"];

//                                     const selectedAnswer = currentQuestion?.user_answer?.selected_answer ?? answersTimed[currentQuestion?.order];
//                                     // const correctAnswer = currentQuestion?.answer;

//                                     const isSelected = selectedAnswer === choice;
//                                     // const isCorrect = correctAnswer === choice;
//                                     const isDisabled = isQuestionAnswered;

//                                     return (
//                                         <label
//                                             key={choice}
//                                             className={`flex items-center gap-2 border p-2 rounded cursor-pointer transition-colors
//                                                     ${isSelected
//                                                     ? "bg-main-color/10 border-main-color"
//                                                     : "hover:bg-gray-50"
//                                                 }
//           ${isDisabled ? "cursor-not-allowed" : ""}
//         `}
//                                             onMouseDown={stopPropagation}
//                                         >
//                                             <input
//                                                 type="radio"
//                                                 name="timedAnswer"
//                                                 value={choice}
//                                                 checked={isSelected}
//                                                 onChange={() => !isDisabled && handleTimedAnswer(choice)}
//                                                 disabled={isDisabled}
//                                             />
//                                             <span className={`${isSelected ? "text-main-color font-bold" : ""}`}>
//                                                 {georgianChoices[index]}
//                                             </span>
//                                             {isSelected && isDisabled && (
//                                                 <span className="ml-auto text-main-color">✓</span>
//                                             )}
//                                         </label>
//                                     );
//                                 })}
//                             </div>


//                             {/* Action Buttons */}
//                             <div className="flex justify-center gap-4 mt-4">
//                                 <button
//                                     onClick={handleSkip}
//                                     className="border px-6 py-2 rounded hover:bg-gray-100 transition-colors"
//                                     type="button"
//                                     disabled={answerLoading || isQuestionAnswered}
//                                 >
//                                     გამოტოვება
//                                 </button>
//                                 <button
//                                     onClick={handleTimedComplete}
//                                     className={`border px-6 py-2 rounded transition-colors ${isQuestionAnswered
//                                         ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                                         : "bg-blue-500 text-white hover:bg-blue-600"
//                                         }`}
//                                     type="button"
//                                     disabled={answerLoading || isQuestionAnswered}
//                                 >
//                                     {answerLoading ? "ატვირთვა..." : isQuestionAnswered ? "უკვე შესრულებულია" : "შესრულება"}
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {/* Resize Handle */}
//                     <div
//                         data-resize-handle="true"
//                         onMouseDown={handleResizeMouseDown}
//                         className="w-8 h-8 bg-gray-100 flex items-center justify-center absolute top-1 left-1 cursor-se-resize rounded hover:bg-gray-200 transition-colors"
//                         title="Resize"
//                     >
//                         <MoveDiagonal2 size={16} />
//                     </div>
//                 </div>}
//         </>
//     );
// };

// export default AnswerModal;







import { MoveDiagonal2, X } from "lucide-react";
import { SetStateAction, Dispatch, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { IAttempt, Question, QuestionWithAnswers } from "../types/types";
import { useAttemptStore } from "../stores/attemptStore";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./reusables/Loader";

interface AnswerModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isTraining: boolean;
    attempt: IAttempt | null | undefined;
    questions: Question[] | QuestionWithAnswers[] | [];
}

const GEO = ["ა", "ბ", "გ", "დ"];
const KEYS = ["a", "b", "g", "d"];

const AnswerModal = ({ isOpen, setIsOpen, isTraining, attempt, questions }: AnswerModalProps) => {
    const activeTab = useMemo(() => isTraining ? "no-time" : "timed", [isTraining]);
    const allAnswered = useMemo(() => (
        questions.length > 0 && questions.every(q =>
            'user_answer' in q && q.user_answer?.selected_answer
        )
    ), [questions]);
    const navigate = useNavigate();
    const [answersNoTime, setAnswersNoTime] = useState<(string | null)[]>([]);
    const [answersTimed, setAnswersTimed] = useState<(string | null)[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
    const [elapsedTimes, setElapsedTimes] = useState<Map<number, number>>(new Map());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { answerLoading, answerQuestion } = useAttemptStore();

    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [size, setSize] = useState({ width: 760, height: 540 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const dragStart = useRef<{ mouseX: number; mouseY: number; divX: number; divY: number } | null>(null);
    const resizeStart = useRef<{ mouseX: number; mouseY: number; width: number; height: number } | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const currentQuestion = useMemo(() => questions[currentQuestionIndex] || null, [questions, currentQuestionIndex]);

    useEffect(() => {
        if (attempt?.total_questions) {
            const init = Array(attempt.total_questions).fill(null);
            setAnswersNoTime(init);
            setAnswersTimed(init);
        }
    }, [attempt?.total_questions]);

    useEffect(() => {
        if (attempt && !isTraining && isOpen) setQuestionStartTime(Date.now());
    }, [attempt, isTraining, isOpen]);

    useEffect(() => {
        if (questions.length > 0) setCurrentQuestionIndex(0);
    }, [questions]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging && dragStart.current) {
            const dx = e.clientX - dragStart.current.mouseX;
            const dy = e.clientY - dragStart.current.mouseY;
            setPosition({
                x: Math.min(Math.max(0, dragStart.current.divX + dx), window.innerWidth - size.width),
                y: Math.min(Math.max(0, dragStart.current.divY + dy), window.innerHeight - size.height),
            });
        } else if (isResizing && resizeStart.current) {
            const dx = e.clientX - resizeStart.current.mouseX;
            const dy = e.clientY - resizeStart.current.mouseY;
            setSize({
                width: Math.min(Math.max(320, resizeStart.current.width + dx), window.innerWidth - position.x),
                height: Math.min(Math.max(240, resizeStart.current.height + dy), window.innerHeight - position.y),
            });
        }
    }, [isDragging, isResizing, position.x, position.y, size.width, size.height]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        dragStart.current = null;
        resizeStart.current = null;
    }, []);

    console.log("Attempt in Modal:", attempt);

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

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).dataset.resizeHandle) return;
        e.preventDefault();
        dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, divX: position.x, divY: position.y };
        setIsDragging(true);
    }, [position]);

    const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        resizeStart.current = { mouseX: e.clientX, mouseY: e.clientY, width: size.width, height: size.height };
        setIsResizing(true);
    }, [size]);

    const handleQuestionSwitch = useCallback((newIndex: number) => {
        if (newIndex < 0 || newIndex >= questions.length) return;
        if (questionStartTime !== null && currentQuestion) {
            const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
            setElapsedTimes(prev => {
                const u = new Map(prev);
                u.set(currentQuestion.order, (u.get(currentQuestion.order) || 0) + timeSpent);
                return u;
            });
        }
        setCurrentQuestionIndex(newIndex);
        setQuestionStartTime(Date.now());
    }, [questions, questionStartTime, currentQuestion]);

    const handleNoTimeAnswer = useCallback((questionIndex: number, choice: string) => {
        setAnswersNoTime(prev => {
            const u = [...prev];
            u[questionIndex] = u[questionIndex] === choice ? null : choice;
            return u;
        });
    }, []);

    const handleTimedAnswer = useCallback((questionIndex: number, choice: string) => {
        setAnswersTimed(prev => {
            const u = [...prev];
            u[questionIndex] = u[questionIndex] === choice ? null : choice;
            return u;
        });
    }, []);

    /** Submit all stored answers sequentially at the end */
    const handleSubmitAll = useCallback(async (answers: (string | null)[], mode: "no-time" | "timed") => {
        if (!attempt) return;
        setIsSubmitting(true);
        try {
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                const answer = answers[i];
                if (!answer) continue;
                const timeSpent = mode === "timed" ? (elapsedTimes.get(q.order) || 0) : 0;
                await answerQuestion(attempt.id.toString(), {
                    question_id: q.id,
                    selected_answer: answer,
                    time_taken: timeSpent,
                });
            }
            navigate(`/quiz/result/${attempt.id}`);
        } catch (err) {
            console.error("Submit failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    }, [attempt, questions, elapsedTimes, answerQuestion, navigate]);

    const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

    const noTimeAnsweredCount = useMemo(() => answersNoTime.filter(Boolean).length, [answersNoTime]);
    const timedAnsweredCount = useMemo(() => answersTimed.filter(Boolean).length, [answersTimed]);

    if (!isOpen) return null;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    const loading = answerLoading || isSubmitting;

    // ─── Answer grid — mirrors AnswerSheetDemo exactly ───────────────────────
    // Each question = one column. Row 0 = question number badges. Rows 1–4 = choice buttons.
    const renderAnswerGrid = (
        answers: (string | null)[],
        onAnswer: (qIndex: number, choice: string) => void,
        activeColIndex?: number
    ) => (
        <table className="border-separate" style={{ borderSpacing: "5px" }}>
            <tbody>
                {/* Row 0: question number badges */}
                <tr>
                    <td className="w-6" />
                    {questions.map((q, i) => {
                        const isAnswered = !!answers[i];
                        const isCurrent = activeColIndex === i;
                        return (
                            <td key={q.id} className="text-center p-0">
                                <button
                                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-200 focus:outline-none
                                        ${isCurrent
                                            ? "bg-blue-500 text-white shadow shadow-blue-200"
                                            : isAnswered
                                                ? "bg-emerald-500 text-white shadow-sm"
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        }`}
                                    onClick={() => activeColIndex !== undefined && handleQuestionSwitch(i)}
                                    onMouseDown={stopPropagation}
                                    title={`კითხვა ${q.order}`}
                                >
                                    {q.order}
                                </button>
                            </td>
                        );
                    })}
                </tr>

                {/* Rows 1–4: one row per choice, one cell per question */}
                {KEYS.map((choiceKey, choiceIndex) => (
                    <tr key={choiceKey}>
                        {/* Georgian letter label */}
                        <td className="text-center pr-1">
                            <span className="text-xs font-bold text-gray-400 select-none">
                                {GEO[choiceIndex]}
                            </span>
                        </td>

                        {questions.map((q, i) => {
                            const isSelected = answers[i] === choiceKey;
                            const isCurrent = activeColIndex === i;
                            return (
                                <td key={q.id} className="text-center p-0">
                                    <button
                                        onClick={() => onAnswer(i, choiceKey)}
                                        onMouseDown={stopPropagation}
                                        className={`w-7 h-7 rounded-md border text-xs font-semibold transition-all duration-150 focus:outline-none
                                            ${isSelected
                                                ? "bg-blue-500 border-blue-500 text-white shadow shadow-blue-200 scale-105"
                                                : isCurrent
                                                    ? "border-blue-200 text-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500"
                                                    : "border-gray-200 text-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-400"
                                            }`}
                                        title={`კითხვა ${q.order} — ${GEO[choiceIndex]}`}
                                    >
                                        {isSelected ? GEO[choiceIndex] : "·"}
                                    </button>
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    // ─── Footer ───────────────────────────────────────────────────────────────
    const renderFooter = (
        answeredCount: number,
        total: number,
        answers: (string | null)[],
        onSubmit: () => void,
        extra?: React.ReactNode
    ) => (
        <div className="shrink-0 border-t bg-gray-50 px-4 py-3 flex items-center justify-between gap-3 select-none">
            {/* Answered / remaining counts */}
            <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-gray-600 font-medium">{answeredCount} შესრულებული</span>
                </span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
                    <span className="text-gray-500">{total - answeredCount} დარჩენილი</span>
                </span>
            </div>

            {/* Mini dot map */}
            <div className="flex flex-wrap gap-[3px] max-w-[160px]">
                {Array.from({ length: total }, (_, i) => (
                    <span
                        key={i}
                        title={`კითხვა ${i + 1}${answers[i] ? ` — ${answers[i]!.toUpperCase()}` : " — გამოტოვებული"}`}
                        className={`inline-block w-2 h-2 rounded-full transition-colors duration-200 ${answers[i] ? "bg-emerald-400" : "bg-gray-200"}`}
                    />
                ))}
            </div>

            {/* Optional extra (e.g. nav arrows for timed mode) */}
            {extra}

            {/* Submit */}
            <button
                onClick={onSubmit}
                onMouseDown={stopPropagation}
                disabled={loading || answeredCount === 0}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95
                    ${answeredCount === total
                        ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200"
                        : answeredCount > 0
                            ? "bg-blue-500 text-white hover:bg-blue-600 shadow-sm shadow-blue-200"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
            >
                {loading ? "..." : `გაგზავნა${answeredCount > 0 ? ` (${answeredCount})` : ""}`}
            </button>
        </div>
    );

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-[200]"
                onClick={() => setIsOpen(false)}
            />

            {loading && !isSubmitting ? <Loader /> :
                <div
                    ref={modalRef}
                    className={`z-[300] fixed bg-white shadow-xl flex flex-col overflow-hidden
                        ${isMobile ? "left-0 right-0 bottom-0 rounded-t-xl" : "rounded-xl cursor-move"}`}
                    style={{
                        top: isMobile ? "auto" : position.y,
                        left: isMobile ? 0 : position.x,
                        width: isMobile ? "100%" : size.width,
                        height: isMobile ? "75vh" : size.height,
                        userSelect: isDragging || isResizing ? "none" : "auto",
                    }}
                    onMouseDown={handleMouseDown}
                    onClick={stopPropagation}
                >
                    {/* ── Title bar ───────────────────────────────────────── */}
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 shrink-0 select-none">
                        <div className="flex items-center gap-2">
                            {!isMobile && (
                                <div
                                    data-resize-handle="true"
                                    onMouseDown={handleResizeMouseDown}
                                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-se-resize"
                                    title="Resize"
                                >
                                    <MoveDiagonal2 size={14} />
                                </div>
                            )}
                            <h2 className="text-sm font-semibold text-gray-700 tracking-wide">
                                პასუხების ფურცელი
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">
                                {activeTab === "no-time" ? noTimeAnsweredCount : timedAnsweredCount} / {questions.length}
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                onMouseDown={stopPropagation}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                                aria-label="Close"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    </div>

                    {/* ── No-Time Tab ─────────────────────────────────────── */}
                    {activeTab === "no-time" && (
                        <>
                            <div className="flex-1 overflow-auto p-4">
                                {renderAnswerGrid(answersNoTime, handleNoTimeAnswer)}
                            </div>
                            {renderFooter(
                                noTimeAnsweredCount,
                                questions.length,
                                answersNoTime,
                                () => handleSubmitAll(answersNoTime, "no-time")
                            )}
                        </>
                    )}

                    {/* ── Timed Tab ───────────────────────────────────────── */}
                    {activeTab === "timed" && (
                        <>
                            <div className="flex-1 overflow-auto p-4">
                                {renderAnswerGrid(answersTimed, handleTimedAnswer, currentQuestionIndex)}
                            </div>
                            {renderFooter(
                                timedAnsweredCount,
                                questions.length,
                                answersTimed,
                                () => handleSubmitAll(answersTimed, "timed"),
                                /* ← / → nav + finish link injected into footer */
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => handleQuestionSwitch(currentQuestionIndex - 1)}
                                        disabled={currentQuestionIndex === 0}
                                        onMouseDown={stopPropagation}
                                        className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        ←
                                    </button>
                                    <span className="text-xs text-gray-400 tabular-nums w-10 text-center">
                                        {currentQuestionIndex + 1}/{questions.length}
                                    </span>
                                    <button
                                        onClick={() => handleQuestionSwitch(currentQuestionIndex + 1)}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                        onMouseDown={stopPropagation}
                                        className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        →
                                    </button>
                                    {allAnswered && (
                                        <Link
                                            to={`/quiz/result/${attempt?.id}`}
                                            onMouseDown={stopPropagation}
                                            className="px-3 py-1 rounded-md text-xs font-semibold border border-emerald-300 text-emerald-600 hover:bg-emerald-50 transition-all"
                                        >
                                            დასრულება
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            }
        </>
    );
};

export default AnswerModal;