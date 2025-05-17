import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { Bell, ChevronRight, Shield, CircleHelp as HelpCircle, LogOut, Award, Settings, Moon } from 'lucide-react-native';
import { useAuth } from '@/context/AuthProvider';
import useProfile from '@/hooks/useProfile';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const { loading, profile, achievements } = useProfile();
  const { isDark, toggleTheme, getColor } = useTheme();

  const handleLogout = async () => {
    await logout();
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={getColor('primary')} />
      </View>
    );
  }

  const full_name = profile?.full_name || '';
  const email = profile?.email || '';
  const avatar_url = profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600';
  const total_goals = profile?.total_goals || 0;
  const completed_goals = profile?.completed_goals || 0;

  const successRate = total_goals > 0
    ? Math.round((completed_goals / total_goals) * 100)
    : 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: getColor('background') }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileHeader}>
        <View style={[styles.profileImageContainer, { borderColor: getColor('primary') }]}>
          <Image
            source={{ uri: avatar_url }}
            style={styles.profileImage}
          />
        </View>
        <Text style={[styles.profileName, { color: getColor('text.primary') }]}>{full_name}</Text>
        <Text style={[styles.profileEmail, { color: getColor('text.secondary') }]}>{email}</Text>
        <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: getColor('button.primary') }]}>
          <Text style={[styles.editProfileText, { color: getColor('primary') }]}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.statsRow, { backgroundColor: getColor('card') }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: getColor('text.primary') }]}>{total_goals}</Text>
          <Text style={[styles.statLabel, { color: getColor('text.secondary') }]}>Total Goals</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: getColor('border') }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: getColor('text.primary') }]}>{completed_goals}</Text>
          <Text style={[styles.statLabel, { color: getColor('text.secondary') }]}>Completed</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: getColor('border') }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: getColor('text.primary') }]}>{successRate}</Text>
          <Text style={[styles.statLabel, { color: getColor('text.secondary') }]}>Success Rate</Text>
        </View>
      </View>

      <View style={styles.sectionTitle}>
        <Award size={20} color={getColor('primary')} />
        <Text style={[styles.sectionTitleText, { color: getColor('text.primary') }]}>Achievements</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.achievementsContainer}
      >
        <View style={[styles.achievementCard, { backgroundColor: getColor('card') }]}>
          <View style={[styles.achievementIcon, { backgroundColor: getColor('button.primary') }]}>
            <Award size={24} color={getColor('primary')} />
          </View>
          <Text style={[styles.achievementTitle, { color: getColor('text.primary') }]}>First Goal</Text>
          <Text style={[styles.achievementDesc, { color: getColor('text.secondary') }]}>Created your first goal</Text>
        </View>
        <View style={[styles.achievementCard, { backgroundColor: getColor('card') }]}>
          <View style={[styles.achievementIcon, { backgroundColor: getColor('status.success') }]}>
            <Award size={24} color={getColor('status.success')} />
          </View>
          <Text style={[styles.achievementTitle, { color: getColor('text.primary') }]}>Milestone Master</Text>
          <Text style={[styles.achievementDesc, { color: getColor('text.secondary') }]}>Completed 10 milestones</Text>
        </View>
        <View style={[styles.achievementCard, styles.lockedAchievement, { backgroundColor: getColor('card') }]}>
          <View style={[styles.achievementIcon, { backgroundColor: getColor('button.primary') }]}>
            <Award size={24} color={getColor('icon.primary')} />
          </View>
          <Text style={[styles.achievementTitle, { color: getColor('icon.primary') }]}>Goal Crusher</Text>
          <Text style={[styles.achievementDesc, { color: getColor('icon.primary') }]}>Complete 5 goals</Text>
        </View>
      </ScrollView>

      <View style={styles.settingsContainer}>
        <View style={styles.sectionTitle}>
          <Settings size={20} color={getColor('primary')} />
          <Text style={[styles.sectionTitleText, { color: getColor('text.primary') }]}>Settings</Text>
        </View>

        <View style={[styles.settingsGroup, { backgroundColor: getColor('card') }]}>
          <View style={[styles.settingItem, { borderBottomColor: getColor('border') }]}>
            <Bell size={20} color={getColor('icon.primary')} />
            <Text style={[styles.settingLabel, { color: getColor('text.primary') }]}>Notifications</Text>
            <Switch
              value={true}
              trackColor={{ false: getColor('border'), true: getColor('button.primary') }}
              thumbColor={true ? getColor('primary') : getColor('card')}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: getColor('border') }]}>
            <Moon size={20} color={getColor('icon.primary')} />
            <Text style={[styles.settingLabel, { color: getColor('text.primary') }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: getColor('border'), true: getColor('button.primary') }}
              thumbColor={isDark ? getColor('primary') : getColor('card')}
            />
          </View>
        </View>

        <View style={[styles.settingsGroup, { backgroundColor: getColor('card') }]}>
          <TouchableOpacity style={[styles.settingItemButton, { borderBottomColor: getColor('border') }]}>
            <Shield size={20} color={getColor('icon.primary')} />
            <Text style={[styles.settingLabel, { color: getColor('text.primary') }]}>Privacy Policy</Text>
            <ChevronRight size={20} color={getColor('icon.primary')} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItemButton, { borderBottomColor: getColor('border') }]}>
            <HelpCircle size={20} color={getColor('icon.primary')} />
            <Text style={[styles.settingLabel, { color: getColor('text.primary') }]}>Help & Support</Text>
            <ChevronRight size={20} color={getColor('icon.primary')} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: getColor('button.danger') }]}>
          <LogOut size={20} color={getColor('status.error')} />
          <Text style={[styles.logoutText, { color: getColor('status.error') }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  editProfileText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginLeft: 8,
  },
  achievementsContainer: {
    paddingBottom: 8,
  },
  achievementCard: {
    borderRadius: 12,
    padding: 16,
    width: 150,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  lockedAchievement: {
    opacity: 0.7,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  settingsContainer: {
    marginTop: 24,
  },
  settingsGroup: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
});