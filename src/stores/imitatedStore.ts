import { create } from "zustand";
import { Category, ImitiatedQuiz, QuizAttemptResponse } from "../types/types";
import { apiV3 } from "../utils/axios";

interface QuizStore {
    loading: boolean;
    categories: Category[];
    quizzes: ImitiatedQuiz[];
    applyResponse: QuizAttemptResponse | null;
    fetchCategoryQuizzes: (categoryId: number) => Promise<void>;
    fetchApplyImitated: (quizId: string, laptop_type: string) => Promise<QuizAttemptResponse | null>;

}

export const useImitatedStore = create<QuizStore>((set) => ({
    loading: false,
    categories: [],
    quizzes: [],
    applyResponse: null,

    fetchCategoryQuizzes: async (categoryId: number) => {
        set({ loading: true })
        try {
            const res = await apiV3.get(`/quiz/category/${categoryId}/quizzes/`);
            set({ quizzes: res.data, loading: false });
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false })
        }
    },

    fetchApplyImitated: async (quizId: string, laptop_type: string) => {
        set({ loading: true })
        try {
            const res = await apiV3.post(`quiz/quizzes/${quizId}/access/`, { laptop_type: laptop_type });
            set({ applyResponse: res.data, loading: false });
            return res.data;
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false })
            return null;
        }
    }
}));
