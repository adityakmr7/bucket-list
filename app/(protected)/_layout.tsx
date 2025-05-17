import { useAuth } from "@/context/AuthProvider"
import { Redirect, Stack } from 'expo-router';

export default function ProtectedLayout() {
    const { user } = useAuth();

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }
    return <Stack />
}