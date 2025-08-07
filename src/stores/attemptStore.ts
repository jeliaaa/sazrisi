import { create } from 'zustand';
import { apiV2 } from '../utils/axios';
import { IAttempt, Question, QuestionWithAnswers } from '../types/types';


interface AttemptStore {
    loading: boolean;
    attempt: IAttempt | null;
    questions: [] | Question[] | QuestionWithAnswers[];
    startQuiz: (categoryId: string, quizId: string) => Promise<void>;
    fetchQuestions: (attemptId: string) => Promise<void>;
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
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false })
        }
    },
    fetchQuestions: async (attemptId: string) => {
        set({ loading: true })
        try {
            const res = await apiV2.post(`/quiz/attempts/${attemptId}/questions`);
            set({ loading: false, questions: res.data });
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false })
        }
    }
}));
