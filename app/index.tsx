import React from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const { loading, user } = useAuth();
    
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }
    
    return user ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
}