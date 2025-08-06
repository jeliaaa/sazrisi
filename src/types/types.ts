// src/types/types.ts

export interface SignUpFormData {
    name: string;
    email: string;
    preferences: string; // store selected color preference
    profile: File | null;
    firstname: string;
    lastname: string;
    password: string;
    rePassword: string;
}

export enum steps {
    info,
    preferences,
    profile,
    success
}
export const stepLabels: Record<steps, string> = {
    [steps.info]: "პირადი ინფორმაცია",
    [steps.preferences]: "პერსონალიზაცია",
    [steps.profile]: "პროფილის სურათი",
    [steps.success]: "იქნა!"
};

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    preference: string;
    //   email_verified: boolean;
}


//Quizs
export interface Category {
    id: number;
    title: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  is_paid: boolean;
  price: string;
  has_access: boolean;
  access_expires_at: string; // ISO date string, e.g., "2025-08-30T18:00:00Z"
}

export interface QuizStart {
  id: number;
  title: string;
  description: string;
  file: string; // URL to a PDF or similar
  time_limit: number; // in minutes
  total_questions: number;
  total_score: number;
  attempt: null | number; // if nullable
  category: number; // this might refer to a parent category ID
  created_at: string; // ISO date string
}
