import React, { JSX, createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { User, AuthResult } from '@/types/auth';
import { supabase } from '@/utils/supabase';
import { Alert } from 'react-native';
import { AuthError } from '@supabase/supabase-js'

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
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {

            if (session) {
                const userData: User = {
                    id: session.user.id,
                    email: session.user?.email || '',
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

        return () => data.subscription.unsubscribe();

    }, []);

    const login = async (email: string, password: string): Promise<AuthResult> => {
        try {
            console.log("Attempting login for:", email);
            const { error, data } = await supabase.auth.signInWithPassword({ email, password });

            router.replace('/');
            if (error) Alert.alert(error.message)
            setLoading(false)
            return { success: true };

        } catch (error) {
            console.error('Login failed', error);
            return {
                success: false,
            };
        }
    };

    const register = async (email: string, password: string, name: string): Promise<AuthResult> => {
        try {
            const { data: { session },
                error, } = await supabase.auth.signUp({
                    email,
                    password,
                })

            // Update profile to add display name
            // await updateProfile(us.user, {
            //     displayName: name
            // });


            if (error) Alert.alert(error.message)
            if (!session) Alert.alert('Please check your inbox for email verification!')
            setLoading(false)
            router.replace('/');
            return { success: true };
        } catch (error) {
            console.error('Registration failed', error);
            return {
                success: false,
            };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await supabase.auth.signOut();
            router.replace('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const resetPassword = async (email: string): Promise<AuthResult> => {
        try {
            await supabase.auth.resetPasswordForEmail(email);
            return { success: true };
        } catch (error) {
            console.error('Password reset failed', error);
            return {
                success: false,
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