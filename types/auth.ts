export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export interface AuthResult {
    success: boolean;
    user?: User;
    error?: string;
}