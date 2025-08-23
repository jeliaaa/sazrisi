import { create } from 'zustand';
import { apiV2 } from '../utils/axios';
import { IAttempt, Question, QuestionWithAnswers, SubmittedAnswer } from '../types/types';


interface AttemptStore {
    loading: boolean;
    attempt: IAttempt | null;
    questions: [] | Question[] | QuestionWithAnswers[];
    startQuiz: (categoryId: string, quizId: string) => Promise<IAttempt | null>;
    fetchQuestions: (attemptId: string) => Promise<void>;
    answerQuestion: (attemptId: string, answer: SubmittedAnswer) => Promise<void>;
    fetchResults: (attemptId: number) => Promise<void>;
}

export const useAttemptStore = create<AttemptStore>((set) => ({
    loading: false,
    questions: [],
    attempt: null,

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
        set({ loading: true });

        try {
            const res = await apiV2.post(`/quiz/attempts/${attemptId}/answer`, answer);

            const updatedQuestion = res.data.updated_question;

            set((state) => ({
                loading: false,
                attempt: res.data.updated_attempt,
                questions: state.questions.map((q) =>
                    q.id === updatedQuestion.id ? updatedQuestion : q
                ),
            }));
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false });
        }
    },
    fetchResults: async (attemptId) => {
        try {
            set({ loading: true });
            const res = await apiV2.get(`/quiz/attempts/${attemptId}/results`);
            set({ attempt: res.data });
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
}));
