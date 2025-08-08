import React, { useRef, useState } from "react";
import {
    CanvasPath,
    ReactSketchCanvas,
    ReactSketchCanvasRef
} from "react-sketch-canvas";
const canvasStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "100%",
    height: "400px",
};

interface Page {
    id: number;
    paths: CanvasPath[]; // stores the sketch paths
}

interface NoteCanvasProps {
    onClose: () => void;
}

export const NoteCanvas: React.FC<NoteCanvasProps> = ({ onClose }) => {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const [pages, setPages] = useState<Page[]>([{ id: 1, paths: [] }]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    // Save current canvas state into pages
    const saveCurrentPagePaths = async () => {
        const paths = await canvasRef.current?.exportPaths();
        if (paths) {
            const updated = [...pages];
            updated[currentPageIndex].paths = paths;
            setPages(updated);
        }
    };

    const switchPage = async (index: number) => {
        await saveCurrentPagePaths(); // save current page
        setCurrentPageIndex(index);
        await canvasRef.current?.clearCanvas();
        const pathsToLoad = pages[index].paths;
        if (pathsToLoad?.length) {
            await canvasRef.current?.loadPaths(pathsToLoad);
        }
    };

    const handleNewPage = async () => {
        await saveCurrentPagePaths(); // save current before adding new
        const newPage: Page = { id: pages.length + 1, paths: [] };
        setPages([...pages, newPage]);
        setCurrentPageIndex(pages.length);
        await canvasRef.current?.clearCanvas();
    };

    const handleSave = async () => {
        if (!canvasRef.current) return;

        try {
            const imageData = await canvasRef.current.exportImage("png");

            // Create a download link
            const link = document.createElement("a");
            link.href = imageData;
            link.download = "drawing.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to export PNG", error);
        }
    };

    return (
        <div className="absolute w-screen h-screen bg-black/20 left-0 top-0 flex justify-center items-end z-50">
            <div className="relative p-4 w-11/12 md:w-3/5 h-3/5 rounded-md bg-white shadow-lg">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded"
                >
                    Close
                </button>

                <div className="mb-4 h-[400px]">
                    <ReactSketchCanvas
                        ref={canvasRef}
                        style={canvasStyle}
                        strokeWidth={3}
                        strokeColor="black"
                        withTimestamp={false}
                    />
                </div>

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
        </div>
    );
};
