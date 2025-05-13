import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGoals } from '@/context/GoalContext';
import GoalCard from '@/components/GoalCard';
import { Target, CirclePlus as PlusCircle, Trophy } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const { goals } = useGoals();
  const router = useRouter();
  
  // Calculate overall progress across all goals
  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;
  
  // Find the next upcoming deadline
  const upcomingDeadline = goals.length > 0
    ? goals
        .filter(goal => !goal.completedAt)
        .sort((a, b) => new Date(a.target).getTime() - new Date(b.target).getTime())[0]
    : null;
  
  const completedGoals = goals.filter(goal => goal.progress === 100).length;
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello there!</Text>
        <Text style={styles.subGreeting}>Track your life goals and make progress daily</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Target size={24} color="#3B82F6" />
          </View>
          <Text style={styles.statValue}>{goals.length}</Text>
          <Text style={styles.statLabel}>Active Goals</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#EBFBEE' }]}>
            <Trophy size={24} color="#10B981" />
          </View>
          <Text style={styles.statValue}>{completedGoals}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{overallProgress}%</Text>
          </View>
          <Text style={styles.statLabel}>Overall Progress</Text>
        </View>
      </View>
      
      {upcomingDeadline && (
        <View style={styles.deadlineContainer}>
          <Text style={styles.sectionTitle}>Next Deadline</Text>
          <View style={styles.deadlineCard}>
            <Text style={styles.deadlineGoal}>{upcomingDeadline.title}</Text>
            <Text style={styles.deadlineDate}>
              {new Date(upcomingDeadline.target).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
        </View>
      )}
      
      <View style={styles.recentContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Goals</Text>
          <TouchableOpacity onPress={() => router.push('/goals')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {goals.length > 0 ? (
          goals
            .slice(0, 3)
            .map(goal => <GoalCard key={goal.id} goal={goal} />)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No goals created yet</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => router.push('/add')}
            >
              <PlusCircle size={18} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Your First Goal</Text>
            </TouchableOpacity>
          </View>
        )}
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
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 4,
  },
  subGreeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#3B82F6',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  deadlineContainer: {
    marginBottom: 24,
  },
  deadlineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deadlineGoal: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
  },
  deadlineDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#F43F5E',
  },
  recentContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  createButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});