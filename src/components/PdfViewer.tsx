import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
    fileUrl: string | undefined;
    page?: number; // optional: specific page to render
}

const PDFViewer = ({ fileUrl, page }: PDFViewerProps) => {
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
            setContainerWidth(containerRef.current.offsetWidth);
        }

        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div className="flex flex-col items-center gap-4" ref={containerRef}>
            <Document file={fileUrl}>
                <Page
                    pageNumber={page ?? 1}   // if no page passed, default to 1
                    width={containerWidth * 0.95}
                />
            </Document>
        </div>
    );
};

export default PDFViewer;
