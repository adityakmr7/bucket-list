import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { Bell, ChevronRight, Shield, CircleHelp as HelpCircle, LogOut, Award, Settings, Moon } from 'lucide-react-native';
import { useAuth } from '@/context/AuthProvider';
import useProfile from '@/hooks/useProfile';

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const { loading, profile, achievements } = useProfile();

  const handleLogout = async () => {
    await logout();
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: avatar_url }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.profileName}>{full_name}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{total_goals}</Text>
          <Text style={styles.statLabel}>Total Goals</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completed_goals}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{successRate}</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>

      <View style={styles.sectionTitle}>
        <Award size={20} color="#3B82F6" />
        <Text style={styles.sectionTitleText}>Achievements</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.achievementsContainer}
      >
        <View style={styles.achievementCard}>
          <View style={[styles.achievementIcon, { backgroundColor: '#EFF6FF' }]}>
            <Award size={24} color="#3B82F6" />
          </View>
          <Text style={styles.achievementTitle}>First Goal</Text>
          <Text style={styles.achievementDesc}>Created your first goal</Text>
        </View>
        <View style={styles.achievementCard}>
          <View style={[styles.achievementIcon, { backgroundColor: '#F0FDF4' }]}>
            <Award size={24} color="#10B981" />
          </View>
          <Text style={styles.achievementTitle}>Milestone Master</Text>
          <Text style={styles.achievementDesc}>Completed 10 milestones</Text>
        </View>
        <View style={[styles.achievementCard, styles.lockedAchievement]}>
          <View style={[styles.achievementIcon, { backgroundColor: '#F1F5F9' }]}>
            <Award size={24} color="#94A3B8" />
          </View>
          <Text style={[styles.achievementTitle, { color: '#94A3B8' }]}>Goal Crusher</Text>
          <Text style={[styles.achievementDesc, { color: '#94A3B8' }]}>Complete 5 goals</Text>
        </View>
      </ScrollView>

      <View style={styles.settingsContainer}>
        <View style={styles.sectionTitle}>
          <Settings size={20} color="#3B82F6" />
          <Text style={styles.sectionTitleText}>Settings</Text>
        </View>

        <View style={styles.settingsGroup}>
          <View style={styles.settingItem}>
            <Bell size={20} color="#64748B" />
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={true}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={true ? '#3B82F6' : '#F9FAFB'}
            />
          </View>

          <View style={styles.settingItem}>
            <Moon size={20} color="#64748B" />
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={false}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={false ? '#3B82F6' : '#F9FAFB'}
            />
          </View>
        </View>

        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingItemButton}>
            <Shield size={20} color="#64748B" />
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <ChevronRight size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItemButton}>
            <HelpCircle size={20} color="#64748B" />
            <Text style={styles.settingLabel}>Help & Support</Text>
            <ChevronRight size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} color="#F43F5E" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    borderColor: '#3B82F6',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  editProfileButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  editProfileText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
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
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E2E8F0',
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
    color: '#1E293B',
    marginLeft: 8,
  },
  achievementsContainer: {
    paddingBottom: 8,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  settingsContainer: {
    marginTop: 24,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#E2E8F0',
  },
  settingItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#F43F5E',
    marginLeft: 8,
  },
});