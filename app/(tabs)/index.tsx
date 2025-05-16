import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGoals } from '@/context/GoalContext';
import GoalCard from '@/components/GoalCard';
import { Target, CirclePlus as PlusCircle, Trophy } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function Dashboard() {
  const { goals } = useGoals();
  const router = useRouter();
  const { getColor } = useTheme();

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
    <ScrollView style={[styles.container, { backgroundColor: getColor('background') }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: getColor('text.primary') }]}>Hello there!</Text>
        <Text style={[styles.subGreeting, { color: getColor('text.secondary') }]}>Track your life goals and make progress daily</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: getColor('card') }]}>
          <View style={[styles.statIconContainer, { backgroundColor: getColor('button.primary') }]}>
            <Target size={24} color={getColor('primary')} />
          </View>
          <Text style={[styles.statValue, { color: getColor('text.primary') }]}>{goals.length}</Text>
          <Text style={[styles.statLabel, { color: getColor('text.secondary') }]}>Active Goals</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: getColor('card') }]}>
          <View style={[styles.statIconContainer, { backgroundColor: getColor('status.success') }]}>
            <Trophy size={24} color={getColor('status.success')} />
          </View>
          <Text style={[styles.statValue, { color: getColor('text.primary') }]}>{completedGoals}</Text>
          <Text style={[styles.statLabel, { color: getColor('text.secondary') }]}>Completed</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: getColor('card') }]}>
          <View style={[styles.progressCircle, { borderColor: getColor('primary') }]}>
            <Text style={[styles.progressText, { color: getColor('primary') }]}>{overallProgress}%</Text>
          </View>
          <Text style={[styles.statLabel, { color: getColor('text.secondary') }]}>Overall Progress</Text>
        </View>
      </View>

      {upcomingDeadline && (
        <View style={styles.deadlineContainer}>
          <Text style={[styles.sectionTitle, { color: getColor('text.primary') }]}>Next Deadline</Text>
          <View style={[styles.deadlineCard, { backgroundColor: getColor('card') }]}>
            <Text style={[styles.deadlineGoal, { color: getColor('text.primary') }]}>{upcomingDeadline.title}</Text>
            <Text style={[styles.deadlineDate, { color: getColor('status.error') }]}>
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
          <Text style={[styles.sectionTitle, { color: getColor('text.primary') }]}>Recent Goals</Text>
          <TouchableOpacity onPress={() => router.push('/goals')}>
            <Text style={[styles.viewAllText, { color: getColor('primary') }]}>View All</Text>
          </TouchableOpacity>
        </View>

        {goals.length > 0 ? (
          goals
            .slice(0, 3)
            .map(goal => <GoalCard key={goal.id} goal={goal} />)
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: getColor('card') }]}>
            <Text style={[styles.emptyText, { color: getColor('text.secondary') }]}>No goals created yet</Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: getColor('primary') }]}
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
    marginBottom: 4,
  },
  subGreeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  deadlineContainer: {
    marginBottom: 24,
  },
  deadlineCard: {
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
    marginBottom: 8,
  },
  deadlineDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
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
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  emptyContainer: {
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
    marginBottom: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
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