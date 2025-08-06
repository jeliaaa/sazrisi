import { create } from 'zustand';
import { apiV2 } from '../utils/axios';
import { Category, Quiz } from '../types/types';


interface QuizStore {
    categories: Category[];
    quizzes: Quiz[];
    fetchCategories: () => Promise<void>;
    fetchCategoryQuizzes: (categoryId: number) => Promise<void>;
}

export const useQuizStore = create<QuizStore>((set) => ({
    categories: [],
    quizzes: [],

    fetchCategories: async () => {
        try {
            const res = await apiV2.get<Category[]>('/category/list/');
            set({ categories: res.data });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    },

    fetchCategoryQuizzes: async (categoryId: number) => {
        try {
            const res = await apiV2.get(`/quiz/category/${categoryId}/quizzes/`);
            set({ quizzes: res.data });
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
        }
    },
}));
