import PDFViewer from "../components/PdfViewer"
import myPdf from '../assets/test.pdf';
import { useEffect, useState } from "react";
import AnswerModal from "../components/AnswerModal";
import { Pen, Sheet } from "lucide-react";
import { useParams } from "react-router-dom";
import { apiV2 } from "../utils/axios";
const QuizSingle = () => {
    const [answersModal, setAnswersModal] = useState<boolean>(false)
    const { catId, id } = useParams();
    console.log(catId, id);

    useEffect(() => {
        const fetchQuizStart = async () => {
            const res = await apiV2.get(`/quiz/category/${catId}/quizzes/${id}`)
            console.log(res)
        }
        fetchQuizStart()
    }, [catId, id])

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

export default QuizSingle