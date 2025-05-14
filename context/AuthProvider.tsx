import React, { JSX, createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import {
    Auth,
    User as FirebaseUser,
    UserCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile,
    AuthError,
    sendPasswordResetEmail,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { auth } from '../config/firebase';
import { User, AuthResult } from '@/types/auth';

// Ensure WebBrowser redirects are handled
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<AuthResult>;
    register: (email: string, password: string, name: string) => Promise<AuthResult>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<AuthResult>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Load stored user data on mount
    useEffect(() => {
        const loadStoredUser = async () => {
            try {
                const storedUser = await SecureStore.getItemAsync('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error loading stored user:', error);
            }
        };

        loadStoredUser();
    }, []);

    useEffect(() => {
        console.log("Setting up auth state listener");
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            console.log("Auth state changed:", firebaseUser?.uid);
            if (firebaseUser) {
                const userData: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                };
                setUser(userData);
                try {
                    await SecureStore.setItemAsync('user', JSON.stringify(userData));
                } catch (error) {
                    console.error('Error storing user data:', error);
                }
            } else {
                setUser(null);
                try {
                    await SecureStore.deleteItemAsync('user');
                } catch (error) {
                    console.error('Error removing stored user data:', error);
                }
            }
            setLoading(false);
        });

        return () => {
            console.log("Cleaning up auth state listener");
            unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string): Promise<AuthResult> => {
        try {
            console.log("Attempting login for:", email);
            const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
            const userData: User = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName,
                photoURL: userCredential.user.photoURL,
            };
            console.log("Login successful for user:", userData.uid);
            router.replace('/');
            return { success: true, user: userData };
        } catch (error) {
            console.error('Login failed', error);
            return {
                success: false,
                error: getAuthErrorMessage(error as AuthError)
            };
        }
    };

    const register = async (email: string, password: string, name: string): Promise<AuthResult> => {
        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile to add display name
            await updateProfile(userCredential.user, {
                displayName: name
            });

            const userData: User = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: name,
                photoURL: userCredential.user.photoURL,
            };

            router.replace('/');
            return { success: true, user: userData };
        } catch (error) {
            console.error('Registration failed', error);
            return {
                success: false,
                error: getAuthErrorMessage(error as AuthError)
            };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await firebaseSignOut(auth);
            router.replace('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const resetPassword = async (email: string): Promise<AuthResult> => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            console.error('Password reset failed', error);
            return {
                success: false,
                error: getAuthErrorMessage(error as AuthError)
            };
        }
    };

    // Helper function to convert Firebase error codes to user-friendly messages
    const getAuthErrorMessage = (error: AuthError): string => {
        switch (error.code) {
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/user-disabled':
                return 'This account has been disabled';
            case 'auth/user-not-found':
                return 'No account found with this email';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/email-already-in-use':
                return 'Email already in use';
            case 'auth/weak-password':
                return 'Password is too weak';
            case 'auth/operation-not-allowed':
                return 'Operation not allowed';
            case 'auth/network-request-failed':
                return 'Network error - check your connection';
            default:
                return 'Authentication failed. Please try again.';
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            register,
            resetPassword,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};