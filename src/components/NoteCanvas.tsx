import React, { useEffect, useRef, useState } from "react";
import {
    CanvasPath,
    ReactSketchCanvas,
    ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { Rnd } from "react-rnd";

const canvasStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "100%",
    height: "100%",
};

interface Page {
    id: number;
    paths: CanvasPath[];
}

interface NoteCanvasProps {
    onClose: () => void;
}

export const NoteCanvas: React.FC<NoteCanvasProps> = ({ onClose }) => {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [pages, setPages] = useState<Page[]>([{ id: 1, paths: [] }]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    // Resize detection
    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024); // 'lg' breakpoint
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // Outside click handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const saveCurrentPagePaths = async () => {
        const paths = await canvasRef.current?.exportPaths();
        if (paths) {
            const updated = [...pages];
            updated[currentPageIndex].paths = paths;
            setPages(updated);
        }
    };

    const switchPage = async (index: number) => {
        await saveCurrentPagePaths();
        setCurrentPageIndex(index);
        await canvasRef.current?.clearCanvas();
        const pathsToLoad = pages[index].paths;
        if (pathsToLoad?.length) {
            await canvasRef.current?.loadPaths(pathsToLoad);
        }
    };

    const handleNewPage = async () => {
        await saveCurrentPagePaths();
        const newPage: Page = { id: pages.length + 1, paths: [] };
        setPages([...pages, newPage]);
        setCurrentPageIndex(pages.length);
        await canvasRef.current?.clearCanvas();
    };

    const handleSave = async () => {
        if (!canvasRef.current) return;

        try {
            const imageData = await canvasRef.current.exportImage("png");

            const link = document.createElement("a");
            link.href = imageData;
            link.download = `drawing-page-${pages[currentPageIndex].id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to export PNG", error);
        }
    };

    const content = (
        <div
            ref={modalRef}
            className="relative p-4 w-full h-full bg-white rounded-md shadow-lg flex flex-col"
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded"
            >
                Close
            </button>

            {/* Canvas */}
            <div className="mb-4 flex-1">
                <ReactSketchCanvas
                    ref={canvasRef}
                    style={canvasStyle}
                    strokeWidth={3}
                    strokeColor="black"
                    withTimestamp={false}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                    {pages.map((page, i) => (
                        <button
                            key={page.id}
                            onClick={() => switchPage(i)}
                            className={`px-3 py-1 rounded ${i === currentPageIndex
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                                }`}
                        >
                            Page {page.id}
                        </button>
                    ))}
                    <button
                        onClick={handleNewPage}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                        + New Page
                    </button>
                </div>

                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Save
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/30 z-200 flex justify-center items-end lg:items-center p-4">
            {isLargeScreen ? (
                <Rnd
                    default={{
                        x: window.innerWidth / 6,
                        y: window.innerHeight / 6,
                        width: window.innerWidth / 2,
                        height: window.innerHeight / 1.5,
                    }}
                    minWidth={300}
                    minHeight={300}
                    bounds="window"
                    dragHandleClassName="handle"
                    className="rounded-md shadow-lg bg-white"
                >
                    {content}
                </Rnd>
            ) : (
                <div
                    ref={modalRef}
                    className="w-full h-[60vh] rounded-t-md shadow-lg bg-white"
                >
                    {content}
                </div>
            )}
        </div>
    );
};
