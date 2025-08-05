import PDFViewer from "../components/PdfViewer"
import myPdf from '../assets/test.pdf';
import { useState } from "react";
import AnswerModal from "../components/AnswerModal";
import { Pen, Sheet } from "lucide-react";
const TestSingle = () => {
    const [answersModal, setAnswersModal] = useState<boolean>(false)

    return (
        <div className="h-screen overflow-hidden">
            <PDFViewer fileUrl={myPdf} />
            {answersModal &&
                <AnswerModal isOpen={answersModal} setIsOpen={setAnswersModal} />
            }
            <div className="fixed z-50 right-5 md:bottom-5 gap-y-3 bottom-20 flex flex-col justify-center items-centershadow-2xl">
                <div title="answers" onClick={() => setAnswersModal(true)} className="cursor-pointer hover:-translate-y-2 transition-all aspect-square bg-main-color w-20 flex justify-center items-center rounded-full">
                    <Sheet fontSize={40} color="white" />
                </div>
                <div className="cursor-pointer hover:-translate-y-2 transition-all aspect-square bg-main-color w-20 flex justify-center items-center rounded-full">
                    <Pen fontSize={40} color="white" />
                </div>
            </div>

        </div>
    )
}

export default TestSingle