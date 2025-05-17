// components/Header.tsx

import { View, Text, Image, Pressable, SafeAreaView, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native'; // Optional: You can use any icon library
import { useRouter } from 'expo-router';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'

export default function AppHeader({ headerProps, avatarUrl, name }: { headerProps: BottomTabHeaderProps, name: string; avatarUrl?: string }) {
    const router = useRouter();

    const handleNavigationToProfile = () => {
        router.push('/profile')
    }
    return (
        <SafeAreaView >
            <View className='flex-row  shadow-light-shadow dark:shadow-dark-shadow elevation-sm px-8 py-6 bg-light-background dark:bg-dark-background items-center justify-between' style={{
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            }}>
                <TouchableOpacity onPress={handleNavigationToProfile}>

                    {/* Avatar and Text */}
                    {avatarUrl ?
                        <View className='flex-row items-center'>
                            <Image
                                source={{ uri: avatarUrl }}
                                className='w-10 h-10 rounded-xl mr-12'
                            />
                            <Text className='font-medium' >
                                Welcome, <Text style={{ fontWeight: '700' }}>{name}</Text>
                            </Text>
                        </View>
                        : <View className=' bg-slate-600 w-10 h-10 flex items-center align-middle justify-center rounded-xl mr-12'>
                            <Text className=' text-light-text-primary dark:text-dark-text-primary '>A</Text>
                        </View>}

                </TouchableOpacity>


                {/* Notification Icon */}
                <Pressable onPress={() => router.push('/notifications')}>
                    <Bell size={24} color="#000" />
                </Pressable>
            </View>

        </SafeAreaView>
    );
}
