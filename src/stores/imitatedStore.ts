import { create } from "zustand";
import { AttemptResult, Category, CompletedAttempt, ImitiatedQuiz, QuizAttemptResponse } from "../types/types";
import { apiV3 } from "../utils/axios";

interface QuizStore {
    loading: boolean;
    categories: Category[];
    quizzes: ImitiatedQuiz[];
    applyResponse: QuizAttemptResponse | null;
    completedAttempts: CompletedAttempt[];
    attemptResult: AttemptResult | null;
    fetchCategoryQuizzes: (categoryId: number) => Promise<void>;
    fetchApplyImitated: (quizId: string, laptop_type: string) => Promise<QuizAttemptResponse | null>;
    fetchCompletedAttempts: () => Promise<void>;
    fetchAttemptResult: (code: string) => Promise<AttemptResult | null>;
}

export const useImitatedStore = create<QuizStore>((set) => ({
    loading: false,
    categories: [],
    quizzes: [],
    applyResponse: null,
    completedAttempts: [],
    attemptResult: null,

    fetchCategoryQuizzes: async (categoryId: number) => {
        set({ loading: true });
        try {
            const res = await apiV3.get(`/quiz/category/${categoryId}/quizzes/`);
            set({ quizzes: res.data, loading: false });
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);
            set({ loading: false });
        }
    },

    fetchApplyImitated: async (quizId: string, laptop_type: string) => {
        set({ loading: true });
        try {
            const res = await apiV3.post(`quiz/quizzes/${quizId}/access/`, { laptop_type });
            set({ applyResponse: res.data, loading: false });
            return res.data;
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);
            set({ loading: false });
            return null;
        }
    },

    fetchCompletedAttempts: async () => {
        set({ loading: true });
        try {
            const res = await apiV3.get("quiz/attempts/completed/list/");
            console.log("Completed attempts:", res.data);
            set({ completedAttempts: res.data, loading: false });
        } catch (error) {
            console.error("Failed to fetch completed attempts:", error);
            set({ loading: false });
        }
    },

    fetchAttemptResult: async (code: string) => {
        set({ loading: true });
        try {
            const res = await apiV3.get(`quiz/attempts/${code}/result/`);
            console.log("Attempt result:", res.data);
            set({ attemptResult: res.data, loading: false });
            return res.data;
        } catch (error) {
            console.error("Failed to fetch attempt result:", error);
            set({ loading: false });
            return null;
        }
    },
}));