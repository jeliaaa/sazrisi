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
    phone: string;
    verification_code: string;
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
    phone: string | null;
    //   email_verified: boolean;
}


//Quizs
export interface Category {
    id: number;
    title: string;
    description?: string;
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
    is_paid: boolean;
    price: string;
    has_access: boolean;
}

export interface IAttempt {
    id: number;
    code?: string
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
    questions: Question[];
    quiz_file?: string | null;
    quiz_explanation?: string | null;
}



export interface Question {
    score: number
    order: number
    id: number
    answer: string | null
    topic: string | null
    user_answer: UserAnswer | null
}
export interface QuestionWithAnswers {
    id: number
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

export interface Note {
    attempt: number;
    note: string;
    created_at: string;
    id: number;
}

export interface NoteBody {
    note: FormData;
}

export interface QuizAttemptResponse {
    code: string;
    quiz_title: string;
    status: string;
}

export interface ImitiatedQuiz {
    id: number;
    title: string;
    description: string;
    category: number;

    time_limit: number;
    total_questions: number;
    total_score: number;

    location: string;
    file: string;

    created_at: string;
    start_datetime: string;
    end_datetime: string;

    is_active: boolean;

    max_space: number;
    user_count: number;
    is_valid_space: boolean;

    available_laptops: number;
    registered_laptops: number;
    is_laptop_available: boolean;

    attempt: IAttempt | null;

    is_paid: boolean;
    price: string;
    has_access: boolean;
}



export interface AttemptUser {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    phone_verified: string;
    avatar: string | null;
    preferences: unknown | null;
}

export interface CompletedAttempt extends ImitiatedQuiz {
    attempt: IAttempt & {
        user: AttemptUser;
        laptop_type: string;
    };
}


// _____ for the imitated quiz result page _____

// base — used during quiz taking
export interface UserAnswer {
    id: number;
    selected_answer: string;
    is_correct: boolean;
    answred_at: Date;
    time_taken: number;
}

// used inside CompletedAttempt / ImitiatedQuiz attempt
export interface UserAnswerSummary {
    id: number;
    selected_answer: string;
    is_correct: boolean;
    time_taken: number;
}

// used inside AttemptResult questions
export interface UserAnswerResult {
    id: number;
    selected_answer: string;
    is_correct: boolean;
    score_earned: number;
    answered_at: string;
    time_taken: number;
}

export interface AttemptResultQuestion {
  id: number;
  score: number;
  order: number;
  user_answer: UserAnswerResult | null;
  topic_id: number | null;
  topic_name: string | null;
}

export interface AttemptResult {
    id: number;
    code: string;
    status: "completed" | "pending" | "in_progress";
    score: number;
    total_questions: number;
    correct_answers: number;
    percentage: string;
    started_at: string;
    completed_at: string;
    time_taken: number | null;
    questions: AttemptResultQuestion[];
    quiz_file: string;
    quiz_explanation: string | null;
}

export interface QuestionResult {
    id: number;
    score: number;
    order: number;
    user_answer: UserAnswerResult | null;
    topic_id: number | null;
    topic_name: string | null;
}

export interface ImitationTopic {
    id: number;
    name: string;
    description: string;
    url: string;
}

export interface TopicAIInsights {
    overall_info: string;
    detailed_info: string;
    examples: { task: string; solution: string }[];
    useful_links: { title: string; url: string }[];
}

export interface AISummary {
    id: number;
    quiz_title: string;
    content: string;
    created_at: string;
}