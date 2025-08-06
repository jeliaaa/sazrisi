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
    name: string;
}
