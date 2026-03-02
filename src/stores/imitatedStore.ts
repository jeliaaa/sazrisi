import { create } from "zustand";
import { Category, Quiz, QuizAttemptResponse } from "../types/types";
import { apiV3 } from "../utils/axios";

interface QuizStore {
    loading: boolean;
    categories: Category[];
    quizzes: Quiz[];
    applyResponse: QuizAttemptResponse | null;
    fetchCategoryQuizzes: (categoryId: number) => Promise<void>;
    fetchApplyImitated: (quizId: string) => Promise<void>;

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

    fetchApplyImitated: async (quizId: string) => {
        set({ loading: true })
        try {
            const res = await apiV3.post(`quiz/quizzes/${quizId}/access/`);
            set({ applyResponse: res.data, loading: false });
            return res.data;
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false })
        }
    }
}));
