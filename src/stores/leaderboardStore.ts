// store/leaderboardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiV2 } from '../utils/axios';
import { AxiosError } from 'axios';
import { User } from './authStore';

export type LeaderboardType = 'day' | 'week' | 'month' | 'semester' | 'year';

export interface LeaderboardEntry {
  position: number;
  user: User;
  total_score: number;
  correct_answers: number;
  total_time_taken_seconds: number;
}

interface LeaderboardState {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  fetchLeaderboard: (type?: LeaderboardType, size?: number, category_id?: number | undefined, quiz_id?: number | undefined, search?: string) => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set) => ({
      leaderboard: [],
      loading: false,
      error: null,

      fetchLeaderboard: async (type = 'day', size = 20, category_id = undefined, quiz_id = undefined, search) => {
        set({ loading: true, error: null });
        try {
          const res = await apiV2.get<LeaderboardEntry[]>('/quiz/leaderboard', {
            params: { type, size, category_id, quiz_id, search },
          });
          set({ leaderboard: res.data, loading: false });
        } catch (err) {
          const error = err as AxiosError<{ error: string }>;
          set({
            error: error.response?.data?.error || 'Failed to fetch leaderboard',
            loading: false,
          });
        }
      },
    }),
    {
      name: 'leaderboard-storage',
      partialize: (state) => ({ leaderboard: state.leaderboard }),
    }
  )
);
