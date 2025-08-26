import PDFViewer from "../components/PdfViewer"
// import myPdf from '../assets/test.pdf';
import { useEffect, useState } from "react";
import AnswerModal from "../components/AnswerModal";
import { Pen, Sheet } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuizStore } from "../stores/quizStore";
import Loader from "../components/reusables/Loader";
import { useAttemptStore } from "../stores/attemptStore";
import { NoteCanvas } from "../components/NoteCanvas";
const QuizSingle = () => {
    const [answersModal, setAnswersModal] = useState<boolean>(false);
    const [noteModal, setNoteModal] = useState<boolean>(false);
    const [isTraining, setIsTraining] = useState<boolean>(false);
    const { catId, id, attemptId } = useParams();
    const { loading, quizzStart, fetchQuizStart } = useQuizStore();
    const { loading: questionLoading, questions, fetchQuestions } = useAttemptStore();



    useEffect(() => {
        if (attemptId && catId && id) {
            fetchQuizStart(catId, id)
            fetchQuestions(attemptId);
        }
        setIsTraining(false)
    }, [attemptId, fetchQuestions, catId, id, fetchQuizStart]);

    useEffect(() => {
        if (noteModal === true) {
            setAnswersModal(false)
        } else if (answersModal === true) {
            setNoteModal(false)
        }
    }, [noteModal, answersModal])

    if (loading || questionLoading) {
        return <Loader />
    }

    return (
        <div className="h-screen overflow-hidden">
            {quizzStart?.file && <PDFViewer fileUrl={quizzStart?.file} />}
            {answersModal &&
                <AnswerModal isOpen={answersModal} setIsOpen={setAnswersModal} isTraining={isTraining} attempt={quizzStart?.attempt} questions={questions} />
            }
            {noteModal && quizzStart?.attempt &&
                <NoteCanvas attemptId={quizzStart?.attempt?.id} onClose={() => setNoteModal(false)} />
            }
            <div className="fixed z-50 right-5 md:bottom-5 gap-y-3 bottom-20 flex flex-col justify-center items-centershadow-2xl">
                <div title="answers" onClick={() => setAnswersModal(true)} className="cursor-pointer hover:-translate-y-2 transition-all aspect-square bg-main-color w-20 flex justify-center items-center rounded-full">
                    <Sheet fontSize={40} color="white" />
                </div>
                <div onClick={() => setNoteModal(true)} className="cursor-pointer hover:-translate-y-2 transition-all aspect-square bg-main-color w-20 flex justify-center items-center rounded-full">
                    <Pen fontSize={40} color="white" />
                </div>
            </div>

        </div>
    )
}

export default QuizSingle