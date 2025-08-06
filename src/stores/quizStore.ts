import { create } from 'zustand';
import { apiV2 } from '../utils/axios';
import { Category } from '../types/types';


interface QuizStore {
    categories: Category[];
    fetchCategories: () => Promise<void>;
}

export const useQuizStore = create<QuizStore>((set) => ({
    categories: [],
    fetchCategories: async () => {
        try {
            const res = await apiV2.get<Category[]>('/category/list/');
            set({ categories: res.data });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    },
    // fetchCategoryQuizes: async (category_id: number) => {
    //     try {
    //         const res = await apiV2.get<any>(`/quiz/category/${category_id}/quizzes`);
    //         set({ quizes: res.data });
    //     } catch (error) {
    //         console.error('Failed to fetch categories:', error);
    //     }
    // },
}));
