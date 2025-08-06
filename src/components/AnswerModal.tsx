import { MoveDiagonal2 } from "lucide-react";
import { SetStateAction, Dispatch, useState, useRef, useEffect, useCallback } from "react";
import { QuizStart } from "../types/types";

const questions = Array.from({ length: 37 }, (_, i) => `Question ${i + 1}`);

interface AnswerModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isTraining: boolean;
    quiz: QuizStart | null;
}

const AnswerModal = ({ isOpen, setIsOpen, isTraining, quiz }: AnswerModalProps) => {
    const [activeTab, setActiveTab] = useState<"no-time" | "timed">("no-time");
    const [answersNoTime, setAnswersNoTime] = useState<(string | null)[]>(Array(quiz?.total_questions).fill(null));
    const [answersTimed, setAnswersTimed] = useState<(string | null)[]>(Array(quiz?.total_questions).fill(null));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    console.log(isTraining)
    useEffect(() => {
        if (isTraining) {
            setActiveTab("no-time")
        } else {
            setActiveTab('timed')
        }
    }, [isTraining])
    // Position and size state
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [size, setSize] = useState({ width: 600, height: 400 });


    // Dragging state
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef<{ mouseX: number; mouseY: number; divX: number; divY: number } | null>(null);

    // Resizing state
    const [isResizing, setIsResizing] = useState(false);
    const resizeStart = useRef<{ mouseX: number; mouseY: number; width: number; height: number } | null>(null);

    // Ref to modal div for bounds calculations
    const modalRef = useRef<HTMLDivElement>(null);

    // Drag handlers
    const onMouseDown = (e: React.MouseEvent) => {
        // Only start drag if clicked outside resize handle
        if ((e.target as HTMLElement).dataset.resizeHandle) return;
        e.preventDefault();
        dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, divX: position.x, divY: position.y };
        setIsDragging(true);
    };


    const onMouseMove = useCallback((e: MouseEvent) => {
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

    const onMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        dragStart.current = null;
        resizeStart.current = null;
    };

    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        } else {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isDragging, isResizing, onMouseMove]);

    const onResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        resizeStart.current = { mouseX: e.clientX, mouseY: e.clientY, width: size.width, height: size.height };
        setIsResizing(true);
    };

    const handleNoTimeAnswer = (questionIndex: number, choice: string) => {
        const updated = [...answersNoTime];
        updated[questionIndex] = choice;
        setAnswersNoTime(updated);
    };

    const handleTimedAnswer = (choice: string) => {
        const updated = [...answersTimed];
        updated[currentQuestionIndex] = choice;
        setAnswersTimed(updated);
    };

    const handleSkip = () => {
        setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
    };

    const handleComplete = () => {
        alert("Complete clicked");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    // This function prevents clicks inside modal from closing it
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-opacity-40 z-40"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="z-50 fixed bg-white p-4 overflow-auto shadow-lg rounded-md cursor-move"
                style={{
                    top: position.y,
                    left: position.x,
                    width: size.width,
                    height: size.height,
                    userSelect: isDragging || isResizing ? "none" : "auto",
                }}
                onMouseDown={onMouseDown}
                onClick={stopPropagation}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-xl font-bold cursor-pointer z-10"
                    aria-label="Close Modal"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    ×
                </button>

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 mb-4 justify-center select-none">
                    პასუხების ფურცელი
                    {/* <button
                        onClick={() => setActiveTab("no-time")}
                        className={`border px-4 py-1 text-sm sm:text-base ${activeTab === "no-time" ? "bg-gray-300" : ""}`}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        დროის გარეშე
                    </button>
                    <button
                        onClick={() => setActiveTab("timed")}
                        className={`border px-4 py-1 text-sm sm:text-base ${activeTab === "timed" ? "bg-gray-300" : ""}`}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        დროით
                    </button> */}
                </div>

                {/* Tab 1: No Time */}
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
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 text-right">
                            <button onClick={() => alert("Submit clicked (implement your logic)")} className="border px-6 py-2">
                                Submit
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab 2: Timed */}
                {activeTab === "timed" && (
                    <div className="flex flex-col gap-4">
                        {/* Question numbers nav */}
                        <div className="overflow-x-auto whitespace-nowrap border-b py-2">
                            {questions.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentQuestionIndex(i)}
                                    className={`inline-block px-3 py-1 mx-1 border rounded-sm ${currentQuestionIndex === i ? "bg-gray-300" : ""
                                        }`}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        {/* Question info */}
                        <div className="text-center text-base font-semibold">
                            კითხვა {currentQuestionIndex + 1} / {questions.length}
                        </div>

                        {/* Answers */}
                        <div className="grid grid-cols-2 gap-4 justify-center max-w-sm mx-auto">
                            {["ა", "ბ", "გ", "დ"].map((choice) => (
                                <label
                                    key={choice}
                                    className="flex items-center gap-2 border p-2 rounded cursor-pointer"
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <input
                                        type="radio"
                                        name="timedAnswer"
                                        value={choice}
                                        checked={answersTimed[currentQuestionIndex] === choice}
                                        onChange={() => handleTimedAnswer(choice)}
                                    />
                                    <span>{choice}</span>
                                </label>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center gap-4 mt-4">
                            <button onClick={handleSkip} className="border px-6 py-2 rounded" type="button">
                                Skip
                            </button>
                            <button onClick={handleComplete} className="border px-6 py-2 rounded" type="button">
                                Complete
                            </button>
                        </div>
                    </div>
                )}

                {/* Resize handle top-left corner */}
                <div
                    data-resize-handle="true"
                    onMouseDown={onResizeMouseDown}
                    className="w-8 h-8 bg-gray-100 flex items-center justify-center absolute top-1 left-1 cursor-se-resize rounded"
                    title="Resize"
                >
                    <MoveDiagonal2 />
                </div>
            </div>
        </>
    );
};

export default AnswerModal;
