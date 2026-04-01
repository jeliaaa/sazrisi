import { useState, useEffect, useRef } from "react";
import { apiV4 } from "../utils/axios";

interface EssayFeedback {
  score: string;
  overall_feedback: string;
  strengths: string[];
  improvements: string[];
  language_quality: string;
  structure: string;
  advice: string;
}

const topic = {
  id: 3,
  category: "ნარკვევი",
  title: "ტექნოლოგია და ადამიანური კავშირები",
  prompt:
    "თქვენი მოსაზრებით, ამცირებს თუ ამდიდრებს თანამედროვე ტექნოლოგია ადამიანებს შორის ნამდვილ კომუნიკაციას? განიხილეთ სხვადასხვა პერსპექტივა, დაეყრდენით კონკრეტულ მაგალითებს და ჩამოაყალიბეთ საკუთარი, სრულად დასაბუთებული პოზიცია.",
  hints: [
    "სოციალური მედიის გავლენა ურთიერთობებზე",
    "ვიდეოზარები და მოშორებული ახლობლები",
    "ეკრანის დრო VS პირდაპირი კონტაქტი",
  ],
  minWords: 250,
};

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export default function TopicWritingPage() {
  const [essay, setEssay]             = useState("");
  const [status, setStatus]           = useState<"idle" | "loading" | "success" | "error">("idle");
  const [wordCount, setWordCount]     = useState(0);
  const [elapsed, setElapsed]         = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [feedback, setFeedback]       = useState<EssayFeedback | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MIN_WORDS = topic.minWords;
  const progress  = Math.min((wordCount / MIN_WORDS) * 100, 100);
  const wordReady = wordCount >= MIN_WORDS;
  const timerGlow = timerActive && status === "idle";

  useEffect(() => {
    setWordCount(countWords(essay));
    if (essay.length > 0 && !timerActive) setTimerActive(true);
  }, [essay, timerActive]);

  useEffect(() => {
    if (timerActive && status === "idle") {
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerActive, status]);

  const formatTime = (s: number) => {
    const m   = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleSubmit = async () => {
    if (!wordReady || status === "loading") return;
    setStatus("loading");
    if (intervalRef.current) clearInterval(intervalRef.current);

    try {
      const res = await apiV4.post("/ai/evaluate-essay/", {
        essay,
        topic_title: topic.title,
        topic_prompt: topic.prompt,
      });
      setFeedback(res.data);
      setStatus("success");
    } catch {
      setStatus("error");
      setTimerActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-dark-color p-4 sm:p-6 md:p-8">
      <div className="w-full mx-auto flex flex-col gap-6">

        {/* ── Topbar ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full bg-main-color/10 border border-main-color/30 text-main-color">
            {topic.category}
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-400 tabular-nums">
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                timerGlow
                  ? "bg-main-color shadow-[0_0_8px_rgba(255,153,0,0.8)]"
                  : "bg-gray-300"
              }`}
            />
            {timerActive ? formatTime(elapsed) : "00:00"}
          </div>
        </div>

        {/* ── Title card ── */}
        <div className="bg-white border border-gray-200 border-t-4 border-t-main-color rounded-2xl p-8 shadow-sm relative overflow-hidden">
          <p className="plain-text tracking-widest uppercase text-main-color mb-3">
            თემა #{topic.id}
          </p>
          <h1 className="title font-bold text-dark-color mb-4 leading-snug">
            {topic.title}
          </h1>
          <div className="w-11 h-0.5 mb-4" style={{ background: "linear-gradient(90deg, #FF9900, transparent)" }} />
          <p className="plain-text text-gray-500 leading-relaxed">{topic.prompt}</p>
        </div>

        {/* ── Writing area ── */}
        {status !== "success" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-widest uppercase text-gray-400">
                თქვენი ნამუშევარი
              </span>
              <span className={`text-sm tabular-nums font-bold transition-colors duration-300 ${wordReady ? "text-green-600" : "text-main-color"}`}>
                {wordReady ? `✓ ${wordCount} სიტყვა` : `${wordCount} / ${MIN_WORDS} სიტყვა`}
              </span>
            </div>

            <textarea
              ref={textareaRef}
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="დაიწყეთ თქვენი თხზულების წერა... გამოთქვით პოზიცია, დაამტკიცეთ მაგალითებით."
              disabled={status === "loading"}
              className="w-full min-h-[360px] p-6 plain-text text-dark-color bg-white border-1.5 border-gray-200 rounded-xl resize-y outline-none leading-relaxed placeholder:text-gray-300 placeholder:italic transition-all duration-200 focus:border-main-color focus:shadow-[0_0_0_3px_rgba(255,153,0,0.12)] disabled:opacity-50 caret-main-color"
            />

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: wordReady
                      ? "linear-gradient(90deg, #FF9900, #16a34a)"
                      : "linear-gradient(90deg, rgba(255,153,0,0.4), #FF9900)",
                  }}
                />
              </div>
              <span className="text-xs text-gray-400 tabular-nums min-w-[30px] text-right">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}

        {/* ── Error banner ── */}
        {status === "error" && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 plain-text text-red-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            შეცდომა. სცადეთ თავიდან.
            <button
              className="ml-auto underline plain-text"
              onClick={() => { setStatus("idle"); setTimerActive(true); }}
            >
              კვლავ ცდა
            </button>
          </div>
        )}

        {/* ── AI loading ── */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-12 bg-gradient-to-br from-main-color/5 to-orange-50 border border-main-color/20 rounded-2xl">
            <div className="w-10 h-10 rounded-full border-3 border-main-color/30 border-t-main-color animate-spin" />
            <p className="plain-text text-gray-500">AI აფასებს თქვენს ნარკვევს...</p>
          </div>
        )}

        {/* ── Submit footer ── */}
        {status !== "success" && status !== "loading" && (
          <div className="flex items-center justify-end gap-4 flex-wrap">
            <p className="flex-1 plain-text text-gray-400 min-w-[160px]">
              {wordReady
                ? "ნარკვევი მზადაა გასაგზავნად."
                : `კიდევ ${MIN_WORDS - wordCount} სიტყვა სჭირდება.`}
            </p>
            <button
              onClick={handleSubmit}
              disabled={!wordReady || status === "loading"}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-dark-color text-main-color plain-text font-bold tracking-wide shadow-md hover:bg-gray-800 hover:-translate-y-px active:translate-y-0 transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              გაგზავნა
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        )}

        {/* ── AI Feedback ── */}
        {status === "success" && feedback && (
          <div className="flex flex-col gap-5 animate-in fade-in">

            {/* Score header */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-main-color/10 to-orange-50 border border-main-color/30 rounded-2xl px-6 py-5">
              <div className="flex flex-col">
                <span className="text-xs tracking-widest uppercase text-main-color font-bold mb-1">AI შეფასება</span>
                <span className="text-4xl font-bold text-dark-color">{feedback.score}</span>
              </div>
              <div className="flex-1 pl-4 border-l border-main-color/20">
                <p className="plain-text text-gray-600 leading-relaxed">{feedback.overall_feedback}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="plain-text font-bold text-green-700 mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ძლიერი მხარეები
                </h3>
                <ul className="flex flex-col gap-2">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="plain-text text-green-800 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                <h3 className="plain-text font-bold text-orange-700 mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  გასაუმჯობესებელი
                </h3>
                <ul className="flex flex-col gap-2">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="plain-text text-orange-800 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Language + Structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="plain-text font-bold text-gray-700 mb-2">ენობრივი ხარისხი</h3>
                <p className="plain-text text-gray-600">{feedback.language_quality}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="plain-text font-bold text-gray-700 mb-2">სტრუქტურა</h3>
                <p className="plain-text text-gray-600">{feedback.structure}</p>
              </div>
            </div>

            {/* Advice */}
            <div className="bg-dark-color rounded-xl p-6">
              <h3 className="plain-text font-bold text-main-color mb-2 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>
                რჩევები სამომავლოდ
              </h3>
              <p className="plain-text text-gray-300 leading-relaxed">{feedback.advice}</p>
            </div>

            {/* Retry */}
            <div className="flex justify-end">
              <button
                onClick={() => { setStatus("idle"); setFeedback(null); setEssay(""); setElapsed(0); setTimerActive(false); }}
                className="plain-text text-sm text-gray-400 underline hover:text-gray-600 transition-colors"
              >
                ახალი ნარკვევი
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
