import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AxiosError } from "axios";
import { apiV2 } from "../utils/axios";

/* =======================
   Types (from response)
======================= */

export interface OverallStats {
    total_answers: number;
    total_errors: number;
    accuracy: number;
    average_time_seconds: number;
    total_quizzes_taken: number;
    total_accumulated_points: number;
    best_result_percent: number;
    login_count: number;
}

export interface CategoryStats {
    labels: string[];
    datasets: {
        total_errors: number[];
        error_percentages: number[];
        average_time_seconds: number[];
    };
}

export interface TopicStats {
    labels: string[];
    datasets: {
        total_errors: number[];
        error_percentages: number[];
        average_time_seconds: number[];
    };
}

export interface AnswerDistribution {
    labels: string[];
    datasets: {
        counts: number[];
    };
}

export interface TopicAccuracy {
    labels: string[];
    datasets: {
        correct: number[];
        incorrect: number[];
        accuracy_percentage: number[];
    };
}

export interface StatisticsResponse {
    overall: OverallStats;
    categories: CategoryStats;
    topics: TopicStats;
    answer_distribution: AnswerDistribution;
    topic_accuracy: TopicAccuracy;
}

/* =======================
   Store State
======================= */

interface StatisticsState {
    stats: StatisticsResponse | null;
    loading: boolean;
    error: string | null;

    fetchStatistics: () => Promise<void>;
}

/* =======================
   Store
======================= */

export const useStatisticsStore = create<StatisticsState>()(
    persist(
        (set) => ({
            stats: null,
            loading: false,
            error: null,

            fetchStatistics: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await apiV2.get<StatisticsResponse>(
                        "/quiz/statistics"
                    );
                    set({
                        stats: res.data,
                        loading: false,
                    });
                } catch (err) {
                    const error = err as AxiosError<{ error?: string }>;
                    set({
                        error:
                            error.response?.data?.error ||
                            "Failed to fetch statistics",
                        loading: false,
                    });
                }
            },
        }),
        {
            name: "statistics-storage",
            partialize: (state) => ({
                stats: state.stats,
            }),
        }
    )
);
