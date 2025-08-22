// src/types/types.ts


//notes
export type PathType = {
    id: string;
    path: {
        x: number;
        y: number;
        pressure?: number;
    }[];
    strokeWidth: number;
    strokeColor: string;
};

//


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
    attempt: null | IAttempt | undefined; // if nullable
    category: number; // this might refer to a parent category ID
    created_at: string; // ISO date string
}

export interface IAttempt {
    id: number;
    quiz: number;
    status: 'started' | 'completed' | 'pending' | string; // you can extend or narrow this
    score: number;
    total_questions: number;
    correct_answers: number;
    percentage: string;
    started_at: string | null; // ISO date string
    completed_at: string | null;
    time_taken: number | null;
    remaining_time: number;
}


export interface Question {
    score: number
    order: number
    id: number
    explanation: string | null
    answer: string | null
    topic: string | null
    user_answer: UserAnswer | null
}

export interface QuestionWithAnswers {
    id: number
    explanation: string
    score: number
    order: number
    answer: string
    topic: string
    user_answer: UserAnswer | null
}

export interface UserAnswer {
    id: number
    selected_answer: string
    is_correct: boolean
    answred_at: Date
    time_taken: number
}
export interface SubmittedAnswer {
    question_id: number
    selected_answer: string
    time_taken: number
}

export interface INews {
    id: number;
    title: string;
    description: string;
    created_at: string;
};
