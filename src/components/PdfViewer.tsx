import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
    fileUrl: string | undefined;
}

const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
    console.log(fileUrl);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
    const goToNextPage = useCallback(() => setPageNumber((prev) => Math.min(prev + 1, numPages)), [numPages])

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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goToNextPage();
            else if (e.key === 'ArrowLeft') goToPrevPage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pageNumber, numPages, goToNextPage]);

    return (
        <div className="flex flex-col items-center gap-4" ref={containerRef}>
            <div className="flex justify-between w-full max-w-lg items-center pt-1 title">
                <button onClick={goToPrevPage} className='flex text-main-color' disabled={pageNumber === 1}>
                    <ChevronLeft className='w-10 h-8' /> <span className='mt-1'>უკან</span>
                </button>
                <p>
                    გვერდი {pageNumber} / {numPages} -დან
                </p>
                <button onClick={goToNextPage} disabled={pageNumber === numPages} className='flex text-main-color'>
                    <span className='mt-1'>შემდეგ</span> <ChevronRight className='w-10 h-8' />
                </button>
            </div>

            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} width={containerWidth * 0.95} />
            </Document>
        </div>
    );
};

export default PDFViewer;
