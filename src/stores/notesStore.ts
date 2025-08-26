import { create } from 'zustand';
import { apiV2 } from '../utils/axios';
import { Note } from '../types/types';


interface NotesStore {
    loading: boolean;
    notes: Note[];
    fetchNotes: (attemptId: string) => Promise<void>;
    addNotes: (attemptId: string, formData: FormData) => Promise<void>;
    updateNotes: (noteId: string, formData: FormData) => Promise<void>;
    deleteNotes: (noteId: string) => Promise<void>;

}

export const useNotesStore = create<NotesStore>((set) => ({
    loading: false,
    notes: [],
    fetchNotes: async (attemptId: string) => {
        set({ loading: true })
        try {
            const res = await apiV2.get<Note[]>(`/attempts/${attemptId}/notes/`);
            set({ notes: res.data });
            set({ loading: false })
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            set({ loading: false })
        }
    },
    addNotes: async (attemptId: string, formData: FormData) => {
        set({ loading: true })
        try {
            const res = await apiV2.post<Note[]>(`/attempts/${attemptId}/notes/`, formData);
            set({ notes: res.data });
            set({ loading: false })
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            set({ loading: false })
        }
    },
    updateNotes: async (noteId: string, formData: FormData) => {
        set({ loading: true })
        try {
            const res = await apiV2.patch<Note[]>(`/notes/${noteId}`, formData);
            set({ notes: res.data });
            set({ loading: false })
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            set({ loading: false })
        }
    },
    deleteNotes: async (noteId: string) => {
        set({ loading: true })
        try {
            await apiV2.delete<Note[]>(`/notes/${noteId}`);
            set({ loading: false })
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            set({ loading: false })
        }
    },

}));
