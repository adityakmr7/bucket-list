import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Mail } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const { getColor } = useTheme();

  const handleSignInWithEmail = () => {
    router.push('/(auth)/login');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: getColor('background') }}>
      <View className="flex-1 items-center flex p-6 justify-between">
        <View />
        <View className="items-center mt-15">
          {/* <Image
            source={require('@/assets/images/logo.png')}
            className="w-30 h-30 mb-6"
            resizeMode="contain"
          /> */}
          <Text
            className="font-['Inter-Bold'] text-2xl text-center mb-3"
            style={{ color: getColor('text.primary') }}
          >
            Welcome to Bucket List
          </Text>
          <Text
            className="font-['Inter-Regular'] text-base text-center leading-6"
            style={{ color: getColor('text.secondary') }}
          >
            Track your goals, achieve your dreams
          </Text>
        </View>

        <View className="mb-10">
          <TouchableOpacity
            className="flex-row items-center justify-center p-4 rounded-xl gap-3"
            style={{ backgroundColor: getColor('primary') }}
            onPress={handleSignInWithEmail}
          >
            <Mail size={20} color="#FFFFFF" />
            <Text className="font-['Inter-SemiBold'] text-base text-white">
              Sign in with Email
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 