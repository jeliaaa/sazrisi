import PDFViewer from "../components/PdfViewer";
import { useEffect, useState, useRef } from "react";
import AnswerModal from "../components/AnswerModal";
import { Pen, Sheet } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "../stores/quizStore";
import Loader from "../components/reusables/Loader";
import { useAttemptStore } from "../stores/attemptStore";
import { NoteCanvas } from "../components/NoteCanvas";

// ─── Timer helpers ────────────────────────────────────────────────────────────
const timerKey = (attemptId: string) => `quiz_timer_deadline_${attemptId}`;

const readDeadline = (attemptId: string): number | null => {
    try {
        const raw = localStorage.getItem(timerKey(attemptId));
        if (!raw) return null;
        const deadline = parseInt(raw, 10);
        return isNaN(deadline) ? null : deadline;
    } catch { return null; }
};

const writeDeadline = (attemptId: string, deadline: number) => {
    try { localStorage.setItem(timerKey(attemptId), String(deadline)); } catch { /* ignore */ }
};

const clearDeadline = (attemptId: string) => {
    try { localStorage.removeItem(timerKey(attemptId)); } catch { /* ignore */ }
};

const secondsFromDeadline = (deadline: number) =>
    Math.max(0, Math.round((deadline - Date.now()) / 1000));

const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "00:00:00";
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
};
// ─────────────────────────────────────────────────────────────────────────────

const QuizSingle = () => {
    const [answersModal, setAnswersModal] = useState<boolean>(false);
    const [noteModal, setNoteModal] = useState<boolean>(false);
    const [isTraining, setIsTraining] = useState<boolean>(false);

    const { catId, id, attemptId } = useParams<{ catId: string; id: string; attemptId: string }>();
    const navigate = useNavigate();

    const { loading, quizzStart, fetchQuizStart } = useQuizStore();
    const { loading: questionLoading, questions, fetchQuestions } = useAttemptStore();

    // Always-fresh ref so the interval callback can navigate correctly
    // even though it was created before quizzStart loaded.
    const resultIdRef = useRef<string>(attemptId ?? "");
    useEffect(() => {
        if (quizzStart?.attempt?.id) {
            resultIdRef.current = String(quizzStart.attempt.id);
        }
    }, [quizzStart?.attempt?.id]);

    // ── Timer ─────────────────────────────────────────────────────────────
    const [secondsLeft, setSecondsLeft] = useState<number | null>(() => {
        if (!attemptId) return null;
        const deadline = readDeadline(attemptId);
        if (deadline === null) return null;
        const remaining = secondsFromDeadline(deadline);
        return remaining > 0 ? remaining : null;
    });

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startTick = (forAttemptId: string) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            const deadline = readDeadline(forAttemptId);
            if (deadline === null) return;
            const secs = secondsFromDeadline(deadline);
            setSecondsLeft(secs);
            if (secs <= 0) {
                clearInterval(intervalRef.current!);
                clearDeadline(forAttemptId);
                navigate(`/quiz/result/${resultIdRef.current}`);
            }
        }, 1000);
    };

    // On mount: if we already had a deadline in localStorage, start ticking immediately.
    useEffect(() => {
        if (!attemptId || secondsLeft === null || secondsLeft <= 0) return;
        startTick(attemptId);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // runs once — secondsLeft was set synchronously in useState init

    // Once attempt loads: create deadline on first visit, or resume if storage was cleared.
    useEffect(() => {
        const attempt = quizzStart?.attempt;
        if (!attempt || !attemptId || !quizzStart?.time_limit) return;
        if (attempt.status === "completed") return;

        const existing = readDeadline(attemptId);
        if (existing && existing > Date.now()) {
            // Already running from the mount effect — nothing to do.
            return;
        }

        // First ever visit: write a fresh deadline and start the tick.
        const deadline = Date.now() + quizzStart.time_limit * 60 * 1000;
        writeDeadline(attemptId, deadline);
        setSecondsLeft(secondsFromDeadline(deadline));
        startTick(attemptId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quizzStart?.attempt?.id]);

    // ── Data fetching ─────────────────────────────────────────────────────
    useEffect(() => {
        if (attemptId && catId && id) {
            fetchQuizStart(catId, id);
            fetchQuestions(attemptId);
        }
        setIsTraining(false);
    }, [attemptId, fetchQuestions, catId, id, fetchQuizStart]);

    useEffect(() => {
        if (noteModal) setAnswersModal(false);
        else if (answersModal) setNoteModal(false);
    }, [noteModal, answersModal]);

    if (loading || questionLoading) return <Loader />;

    const attempt = quizzStart?.attempt;
    const isCompleted = attempt?.status === "completed";
    const hasTimer = !isCompleted && secondsLeft !== null && secondsLeft > 0;

    const isWarning = hasTimer && secondsLeft! <= 600; // ≤ 10 min
    const isDanger  = hasTimer && secondsLeft! <= 180; // ≤ 3 min

    return (
        <div className="h-screen overflow-hidden">
            {quizzStart?.file && <PDFViewer fileUrl={quizzStart.file} />}

            {answersModal && (
                <AnswerModal
                    isOpen={answersModal}
                    setIsOpen={setAnswersModal}
                    isTraining={isTraining}
                    attempt={attempt}
                    questions={questions}
                />
            )}

            {noteModal && <NoteCanvas onClose={() => setNoteModal(false)} />}

            {/* ── Countdown timer ───────────────────────────────────────────── */}
            {hasTimer && (
                <div
                    className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border text-sm font-semibold tabular-nums select-none pointer-events-none transition-colors duration-500
                        ${isDanger
                            ? "bg-red-500 border-red-400 text-white animate-pulse"
                            : isWarning
                                ? "bg-amber-50 border-amber-300 text-amber-700"
                                : "bg-white border-gray-200 text-gray-700"
                        }`}
                >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isDanger ? "bg-white" : isWarning ? "bg-amber-400" : "bg-emerald-400"}`} />
                    <span>{formatTime(secondsLeft!)}</span>
                </div>
            )}

            {/* ── FAB buttons ───────────────────────────────────────────────── */}
            <div className="fixed z-50 right-5 md:bottom-5 gap-y-3 bottom-20 flex flex-col justify-center items-center">
                <div
                    title="answers"
                    onClick={() => setAnswersModal(true)}
                    className="cursor-pointer hover:-translate-y-2 transition-all aspect-square bg-main-color w-20 flex justify-center items-center rounded-full"
                >
                    <Sheet fontSize={40} color="white" />
                </div>
                <div
                    onClick={() => setNoteModal(true)}
                    className="cursor-pointer hover:-translate-y-2 transition-all aspect-square bg-main-color w-20 flex justify-center items-center rounded-full"
                >
                    <Pen fontSize={40} color="white" />
                </div>
            </div>
        </div>
    );
};

export default QuizSingle;