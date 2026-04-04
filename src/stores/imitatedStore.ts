import { create } from "zustand";
import { AISummary, AttemptResult, Category, CompletedAttempt, ImitiatedQuiz, ImitationTopic, QuizAttemptResponse, TopicAIInsights } from "../types/types";
import { apiV3 } from "../utils/axios";

interface QuizStore {
    loading: boolean;
    categories: Category[];
    quizzes: ImitiatedQuiz[];
    applyResponse: QuizAttemptResponse | null;
    completedAttempts: CompletedAttempt[];
    attemptResult: AttemptResult | null;
    aiSummaries: AISummary[];
    fetchCategoryQuizzes: (categoryId: number) => Promise<void>;
    fetchApplyImitated: (quizId: string, laptop_type: string) => Promise<QuizAttemptResponse | null>;
    fetchCompletedAttempts: () => Promise<void>;
    fetchAttemptResult: (code: string) => Promise<AttemptResult | null>;
    fetchTopic: (topicId: number) => Promise<ImitationTopic | null>;
    fetchTopicAIInsights: (topicId: number) => Promise<TopicAIInsights | null>;
    fetchAttemptAISummary: (code: string) => Promise<AISummary | null>;
    fetchAISummaryHistory: () => Promise<void>;
}

export const useImitatedStore = create<QuizStore>((set) => ({
    loading: false,
    categories: [],
    quizzes: [],
    applyResponse: null,
    completedAttempts: [],
    attemptResult: null,
    aiSummaries: [],

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
            set({ attemptResult: res.data, loading: false });
            return res.data;
        } catch (error) {
            console.error("Failed to fetch attempt result:", error);
            set({ loading: false });
            return null;
        }
    },

    fetchTopic: async (topicId: number) => {
        try {
            const res = await apiV3.get(`quiz/topics/${topicId}/`);
            return res.data as ImitationTopic;
        } catch (error) {
            console.error("Failed to fetch topic:", error);
            return null;
        }
    },

    fetchTopicAIInsights: async (topicId: number) => {
        try {
            const res = await apiV3.post(`quiz/topics/${topicId}/ai-insights/`, {}, { timeout: 120000 });
            return res.data as TopicAIInsights;
        } catch (error) {
            console.error("Failed to fetch topic AI insights:", error);
            return null;
        }
    },

    fetchAttemptAISummary: async (code: string) => {
        try {
            const res = await apiV3.post(`quiz/attempts/${code}/ai-summary/`, {}, { timeout: 120000 });
            const summary = res.data as AISummary;
            set((state) => ({ aiSummaries: [summary, ...state.aiSummaries] }));
            return summary;
        } catch (error) {
            console.error("Failed to fetch AI summary:", error);
            return null;
        }
    },

    fetchAISummaryHistory: async () => {
        set({ loading: true });
        try {
            const res = await apiV3.get("quiz/ai-summaries/");
            set({ aiSummaries: res.data, loading: false });
        } catch (error) {
            console.error("Failed to fetch AI summary history:", error);
            set({ loading: false });
        }
    },
}));