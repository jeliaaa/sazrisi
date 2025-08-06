import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface AnswerModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isTraining: boolean;
}

const AnswerModal = ({ isOpen, setIsOpen, isTraining }: AnswerModalProps) => {
    const [activeTab, setActiveTab] = useState<"no-time" | "timed">("no-time");
    const modalRef = useRef<HTMLDivElement>(null);
    const dragOffset = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const isResizing = useRef(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ width: 600, height: 400 });

    useEffect(() => {
        if (isTraining) {
            setActiveTab("no-time");
        }
    }, [isTraining]);

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!modalRef.current) return;

            if (isDragging.current) {
                const clientX = (e instanceof TouchEvent ? e.touches[0].clientX : e.clientX);
                const clientY = (e instanceof TouchEvent ? e.touches[0].clientY : e.clientY);

                const newX = clientX - dragOffset.current.x;
                const newY = clientY - dragOffset.current.y;

                setPosition({ x: newX, y: newY });
            }

            if (isResizing.current) {
                const clientX = (e instanceof TouchEvent ? e.touches[0].clientX : e.clientX);
                const clientY = (e instanceof TouchEvent ? e.touches[0].clientY : e.clientY);

                const modalRect = modalRef.current.getBoundingClientRect();
                const newWidth = clientX - modalRect.left;
                const newHeight = clientY - modalRect.top;

                setSize({
                    width: Math.max(300, newWidth),
                    height: Math.max(200, newHeight),
                });
            }
        };

        const handleUp = () => {
            isDragging.current = false;
            isResizing.current = false;
        };

        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleUp);
        document.addEventListener("touchmove", handleMove);
        document.addEventListener("touchend", handleUp);

        return () => {
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mouseup", handleUp);
            document.removeEventListener("touchmove", handleMove);
            document.removeEventListener("touchend", handleUp);
        };
    }, []);

    const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        if (!modalRef.current) return;

        const rect = modalRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
        isDragging.current = true;
    };

    const handleStartResize = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        isResizing.current = true;
    };

    const handleClose = () => setIsOpen(false);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={handleClose}
        >
            <div
                ref={modalRef}
                className="bg-white shadow-lg rounded-lg overflow-hidden relative"
                style={{
                    width: size.width,
                    height: size.height,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    touchAction: "none",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag handle */}
                <div
                    className="cursor-move bg-gray-100 px-4 py-2 font-semibold select-none"
                    onMouseDown={handleStartDrag}
                    onTouchStart={handleStartDrag}
                >
                    შეკითხვებზე პასუხები
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 py-2 border-b">
                    <button
                        className={`px-4 py-1 ${activeTab === "no-time" ? "bg-gray-200 font-bold" : ""}`}
                        onClick={() => setActiveTab("no-time")}
                    >
                        დროის გარეშე
                    </button>
                    {!isTraining && (
                        <button
                            className={`px-4 py-1 ${activeTab === "timed" ? "bg-gray-200 font-bold" : ""}`}
                            onClick={() => setActiveTab("timed")}
                        >
                            დროით
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 h-[calc(100%-100px)] overflow-auto text-sm sm:text-base">
                    {activeTab === "no-time" && <p>დროის გარეშე კითხვები აქ გამოჩნდება.</p>}
                    {activeTab === "timed" && !isTraining && <p>დროით კითხვები აქ გამოჩნდება.</p>}
                </div>

                {/* Resize handle */}
                <div
                    className="absolute bottom-0 right-0 w-4 h-4 bg-transparent cursor-se-resize"
                    onMouseDown={handleStartResize}
                    onTouchStart={handleStartResize}
                />
            </div>
        </div>
    );
};

export default AnswerModal;
