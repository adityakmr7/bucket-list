
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/utils/supabase';

type Profile = {
    full_name: string;
    email: string;
    avatar_url: string | null;
    total_goals: number;
    completed_goals: number;
}

const useProfile = () => {
    const { logout, user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, email, avatar_url, total_goals, completed_goals')
                .eq('id', user?.id)
                .maybeSingle();

            if (error) console.error('Error fetching profile:', error);
            else setProfile(data);

            setLoading(false);
        };

        if (user) fetchProfile();
    }, [user]);

    useEffect(() => {
        const fetchAchievements = async () => {
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .eq('user_id', user?.id);

            if (error) console.error('Error fetching achievements:', error);
            else setAchievements(data);
        };

        if (user) fetchAchievements();
    }, [user]);
    return {
        profile,
        achievements,
        loading,
    }
}


export default useProfile;