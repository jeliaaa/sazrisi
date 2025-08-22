import { create } from 'zustand';
import { apiV2 } from '../utils/axios';

interface NewsStore {
    loading: boolean;
    news: any;
    newsSingle: any;
    fetchNews: () => Promise<void>;
    fetchNewsSingle: (newsId: number) => Promise<void>;
}

export const useNewsStore = create<NewsStore>((set) => ({
    loading: false,
    news: [],
    newsSingle: [],
    fetchNews: async () => {
        set({ loading: true })
        try {
            const res = await apiV2.get('/blog/list');
            set({ news: res.data });
            set({ loading: false })

        } catch (error) {
            console.error('Failed to fetch categories:', error);
            set({ loading: false })

        }
    },

    fetchNewsSingle: async (newsId: number) => {
        set({ loading: true })
        try {
            const res = await apiV2.get(`/blog/detals/${newsId}`);
            set({ newsSingle: res.data, loading: false });
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            set({ loading: false })
        }
    }
}));
