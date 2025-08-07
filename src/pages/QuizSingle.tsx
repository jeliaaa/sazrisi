import PDFViewer from "../components/PdfViewer"
// import myPdf from '../assets/test.pdf';
import { useEffect, useState } from "react";
import AnswerModal from "../components/AnswerModal";
import { Pen, Sheet } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuizStore } from "../stores/quizStore";
import Loader from "../components/reusables/Loader";
import { useAttemptStore } from "../stores/attemptStore";
const QuizSingle = () => {
    const [answersModal, setAnswersModal] = useState<boolean>(false);
    const [isTraining, setIsTraining] = useState<boolean>(false);
    const { attemptId } = useParams();
    const { loading, quizzStart } = useQuizStore();
    const { questions, fetchQuestions } = useAttemptStore();



    useEffect(() => {
        if (attemptId) {
            fetchQuestions(attemptId);
        }
        setIsTraining(false)
    }, [attemptId, fetchQuestions]);

    if (loading) {
        return <Loader />
    }

    return (
        <div className="h-screen overflow-hidden">
            {quizzStart?.file && <PDFViewer fileUrl={quizzStart?.file} />}
            {answersModal &&
                <AnswerModal isOpen={answersModal} setIsOpen={setAnswersModal} isTraining={isTraining} attempt={quizzStart?.attempt} questions={questions} />
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