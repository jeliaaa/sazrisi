// components/NoteCanvas.tsx
import React, { useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

const canvasStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "100%",
    height: "400px",
};

interface Page {
    id: number;
    data: string | null; // base64 or JSON
}

export const NoteCanvas: React.FC = () => {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const [pages, setPages] = useState<Page[]>([{ id: 1, data: null }]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const handleSave = async () => {
        const data = await canvasRef.current?.exportImage("png");
        if (data) {
            const updatedPages = [...pages];
            updatedPages[currentPageIndex].data = data;
            setPages(updatedPages);
            console.log("Saved Page", currentPageIndex + 1, data);
            // Optionally, send to backend
        }
    };

    const handleNewPage = () => {
        setPages([...pages, { id: pages.length + 1, data: null }]);
        setCurrentPageIndex(pages.length);
    };

    const switchPage = async (index: number) => {
        // Save current page before switching
        const currentData = await canvasRef.current?.exportImage("png");
        const updatedPages = [...pages];
        updatedPages[currentPageIndex].data = currentData || null;
        setPages(updatedPages);

        // Clear canvas and load new page
        setCurrentPageIndex(index);
        canvasRef.current?.clearCanvas();
    };

    return (
        <div className="absolute bg-black/10 left-0 top-0 flex justify-center items-end ">
            <div className="p-4 border w-3/5 h-3/5  rounded-md bg-white">
                <div className="mb-4">
                    <ReactSketchCanvas
                        ref={canvasRef}
                        style={canvasStyle}
                        strokeWidth={3}
                        strokeColor="black"
                    />
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                        {pages.map((page, i) => (
                            <button
                                key={page.id}
                                onClick={() => switchPage(i)}
                                className={`px-3 py-1 rounded ${i === currentPageIndex ? "bg-blue-500 text-white" : "bg-gray-200"
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
