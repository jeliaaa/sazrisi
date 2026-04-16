import { create } from 'zustand';
import { apiV2 } from '../utils/axios';
import { IAttempt, Question, QuestionWithAnswers, QuizAISummary, QuizTopic, QuizTopicAIInsights, SubmittedAnswer } from '../types/types';


interface AttemptStore {
    loading: boolean;
    answerLoading: boolean;
    attempt: IAttempt | null;
    questions: [] | Question[] | QuestionWithAnswers[];
    quizAiSummaries: QuizAISummary[];
    startQuiz: (categoryId: string, quizId: string) => Promise<IAttempt | null>;
    fetchQuestions: (attemptId: string) => Promise<void>;
    answerQuestion: (attemptId: string, answer: SubmittedAnswer) => Promise<void>;
    fetchResult: (attemptId: number) => Promise<void>;
    fetchQuizAISummary: (attemptId: number) => Promise<QuizAISummary | null>;
    fetchQuizAISummaryHistory: () => Promise<void>;
    fetchQuizTopic: (topicId: number) => Promise<QuizTopic | null>;
    fetchQuizTopicAIInsights: (topicId: number) => Promise<QuizTopicAIInsights | null>;
}

export const useAttemptStore = create<AttemptStore>((set) => ({
    loading: false,
    questions: [],
    attempt: null,
    answerLoading: false,
    quizAiSummaries: [],
    startQuiz: async (categoryId: string, quizId: string) => {
        set({ loading: true })
        try {
            const res = await apiV2.post(`/quiz/category/${categoryId}/quizzes/${quizId}/start/`);
            set({ loading: false, attempt: res.data });
            return res.data
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false })
        }
    },
    fetchQuestions: async (attemptId: string) => {
        set({ loading: true })
        try {
            const res = await apiV2.get(`/quiz/attempts/${attemptId}/questions`);
            set({ loading: false, questions: res.data });
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false })
        }
    },
    answerQuestion: async (attemptId: string, answer: SubmittedAnswer) => {
        set({ answerLoading: true });

        try {
            const res = await apiV2.post(`/quiz/attempts/${attemptId}/answer`, answer);

            const updatedQuestion = res.data.updated_question;

            set((state) => ({
                answerLoading: false,
                attempt: res.data.updated_attempt,
                questions: state.questions.map((q) =>
                    q.id === updatedQuestion.id ? updatedQuestion : q
                ),
            }));
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ answerLoading: false });
        }
    },
    fetchResult: async (attemptId) => {
        try {
            set({ loading: true });
            const res = await apiV2.get(`/quiz/attempts/${attemptId}/result`);
            set({ attempt: res.data });
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    fetchQuizAISummary: async (attemptId: number) => {
        try {
            const res = await apiV2.post(`/quiz/attempts/${attemptId}/ai-summary/`, {}, { timeout: 120000 });
            const summary = res.data as QuizAISummary;
            set((state) => ({ quizAiSummaries: [summary, ...state.quizAiSummaries] }));
            return summary;
        } catch (error) {
            console.error('Failed to fetch quiz AI summary:', error);
            return null;
        }
    },
    fetchQuizAISummaryHistory: async () => {
        set({ loading: true });
        try {
            const res = await apiV2.get('/quiz/ai-summaries/');
            set({ quizAiSummaries: res.data, loading: false });
        } catch (error) {
            console.error('Failed to fetch quiz AI summary history:', error);
            set({ loading: false });
        }
    },
    fetchQuizTopic: async (topicId: number) => {
        try {
            const res = await apiV2.get(`/quiz/topics/${topicId}/`);
            return res.data as QuizTopic;
        } catch (error) {
            console.error('Failed to fetch quiz topic:', error);
            return null;
        }
    },
    fetchQuizTopicAIInsights: async (topicId: number) => {
        try {
            const res = await apiV2.post(`/quiz/topics/${topicId}/ai-insights/`, {}, { timeout: 120000 });
            return res.data as QuizTopicAIInsights;
        } catch (error) {
            console.error('Failed to fetch quiz topic AI insights:', error);
            return null;
        }
    },
}));
