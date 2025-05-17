export interface User {
    id: string;
    email: string | null;
    name: string
}

export interface AuthResult {
    success: boolean;
    user?: User;
    error?: string;
}

export interface Milestone {
    id: string;
    goal_id: string;
    title: string;
    completed: boolean;
}

export interface Goal {
    id: string;
    user_id: string;
    title: string;
    target: Date;
    created_at: Date;
    progress: number;
    milestones: Milestone[];
}