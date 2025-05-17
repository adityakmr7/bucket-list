import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import { Mail, Lock, User } from 'lucide-react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const { register } = useAuth();
    const { getColor } = useTheme();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!fullName || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await register(email, password, fullName);
        } catch (err) {
            setError('Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1" style={{ backgroundColor: getColor('background') }}>
            <View className="flex-1 p-6 justify-center">
                <View className="mb-8">
                    <Text
                        className="font-['Inter-Bold'] text-3xl mb-2"
                        style={{ color: getColor('text.primary') }}
                    >
                        Create Account
                    </Text>
                    <Text
                        className="font-['Inter-Regular'] text-base"
                        style={{ color: getColor('text.secondary') }}
                    >
                        Sign up to get started
                    </Text>
                </View>

                <View className="space-y-4">
                    <View className="space-y-2">
                        <Text
                            className="font-['Inter-Medium'] py-2 text-sm"
                            style={{ color: getColor('text.primary') }}
                        >
                            Full Name
                        </Text>
                        <View
                            className="flex-row items-center p-4 rounded-xl"
                            style={{ backgroundColor: getColor('card') }}
                        >
                            <User size={20} color={getColor('icon.primary')} />
                            <TextInput
                                className="flex-1 ml-3 font-['Inter-Regular'] "
                                placeholder="Enter your full name"
                                placeholderTextColor={getColor('text.secondary')}
                                value={fullName}
                                onChangeText={setFullName}
                                style={{ color: getColor('text.primary') }}
                            />
                        </View>
                    </View>

                    <View className="space-y-2">
                        <Text
                            className="font-['Inter-Medium'] text-sm py-2"
                            style={{ color: getColor('text.primary') }}
                        >
                            Email
                        </Text>
                        <View
                            className="flex-row items-center p-4 rounded-xl"
                            style={{ backgroundColor: getColor('card') }}
                        >
                            <Mail size={20} color={getColor('icon.primary')} />
                            <TextInput
                                className="flex-1 ml-3 font-['Inter-Regular'] "
                                placeholder="Enter your email"
                                placeholderTextColor={getColor('text.secondary')}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={{ color: getColor('text.primary') }}
                            />
                        </View>
                    </View>

                    <View className="space-y-2">
                        <Text
                            className="font-['Inter-Medium'] text-sm py-2"
                            style={{ color: getColor('text.primary') }}
                        >
                            Password
                        </Text>
                        <View
                            className="flex-row items-center p-4 rounded-xl"
                            style={{ backgroundColor: getColor('card') }}
                        >
                            <Lock size={20} color={getColor('icon.primary')} />
                            <TextInput
                                className="flex-1 ml-3 font-['Inter-Regular'] "
                                placeholder="Create a password"
                                placeholderTextColor={getColor('text.secondary')}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={{ color: getColor('text.primary') }}
                            />
                        </View>
                    </View>

                    {error ? (
                        <Text
                            className="font-['Inter-Medium'] text-sm pt-4 text-center"
                            style={{ color: getColor('status.error') }}
                        >
                            {error}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        className="p-4 rounded-xl items-center mt-4"
                        style={{ backgroundColor: getColor('primary') }}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="font-['Inter-SemiBold'] text-base text-white">
                                Create Account
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mt-4"
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text
                            className="font-['Inter-Medium'] text-base text-center"
                            style={{ color: getColor('primary') }}
                        >
                            Already have an account? Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}