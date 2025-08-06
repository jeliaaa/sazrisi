import { create } from 'zustand';
import { apiV2 } from '../utils/axios';
import { Category, Quiz, QuizStart } from '../types/types';


interface QuizStore {
    loading: boolean;
    categories: Category[];
    quizzes: Quiz[];
    quizzStart: QuizStart | null;
    fetchCategories: () => Promise<void>;
    fetchCategoryQuizzes: (categoryId: number) => Promise<void>;
    fetchQuizStart: (categoryId: string, quizId: string) => Promise<void>;
    startQuiz: (categoryId: string, quizId: string) => Promise<void>;
}

export const useQuizStore = create<QuizStore>((set) => ({
    loading: false,
    categories: [],
    quizzes: [],
    quizzStart: null,
    fetchCategories: async () => {
        set({ loading: true })
        try {
            const res = await apiV2.get<Category[]>('/category/list/');
            set({ categories: res.data });
            set({ loading: false })

        } catch (error) {
            console.error('Failed to fetch categories:', error);
            set({ loading: false })

        }
    },

    fetchCategoryQuizzes: async (categoryId: number) => {
        set({ loading: true })
        try {
            const res = await apiV2.get(`/quiz/category/${categoryId}/quizzes/`);
            set({ quizzes: res.data, loading: false });
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false })
        }
    },
    fetchQuizStart: async (categoryId: string, quizId: string) => {
        set({ loading: true })
        try {
            const res = await apiV2.get(`/quiz/category/${categoryId}/quizzes/${quizId}/`);
            set({ quizzStart: res.data, loading: false });
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false })
        }
    },
    startQuiz: async (categoryId: string, quizId: string) => {
        set({ loading: true })
        try {
            await apiV2.get(`/quiz/category/${categoryId}/quizzes/${quizId}/start/`);
            set({ loading: false });
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false })
        }
    },
}));
