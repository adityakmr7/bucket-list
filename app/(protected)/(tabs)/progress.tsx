import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGoals } from '@/context/GoalContext';
import ProgressCircle from '@/components/ProgressCircle';
import { CalendarDays, TrendingUp, Award, Dumbbell, BookOpen, BriefcaseBusiness } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function ProgressScreen() {
  const { goals } = useGoals();
  const [activeTab, setActiveTab] = useState<'overview' | 'categories'>('overview');
  const { getColor } = useTheme();

  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    return Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);
  };

  const completeGoalsCount = goals.filter(goal => goal.progress === 100).length;
  const inProgressGoalsCount = goals.filter(goal => goal.progress > 0 && goal.progress < 100).length;
  const notStartedGoalsCount = goals.filter(goal => goal.progress === 0).length;

  // Calculate category percentages
  const categoryStats = goals.reduce((acc, goal) => {
    if (!acc[goal.category]) {
      acc[goal.category] = { count: 0, totalProgress: 0 };
    }
    acc[goal.category].count += 1;
    acc[goal.category].totalProgress += goal.progress;
    return acc;
  }, {} as Record<string, { count: number; totalProgress: number }>);

  const categoryProgressData = Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    progress: Math.round(stats.totalProgress / stats.count),
    count: stats.count
  })).sort((a, b) => b.progress - a.progress);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness':
        return <Dumbbell size={20} color="#FFFFFF" />;
      case 'education':
        return <BookOpen size={20} color="#FFFFFF" />;
      case 'career':
        return <BriefcaseBusiness size={20} color="#FFFFFF" />;
      default:
        return <Award size={20} color="#FFFFFF" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness':
        return '#4ECDC4';
      case 'education':
        return '#3B82F6';
      case 'career':
        return '#FF6B6B';
      case 'finance':
        return '#10B981';
      case 'personal':
        return '#8B5CF6';
      case 'travel':
        return '#F59E0B';
      case 'creative':
        return '#FFD166';
      case 'relationships':
        return '#EC4899';
      case 'health':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: getColor('background') }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: getColor('text.primary') }]}>Your Progress</Text>
        <Text style={[styles.headerSubtitle, { color: getColor('text.secondary') }]}>Track your journey toward your goals</Text>
      </View>

      <View style={[styles.overallProgressCard, { backgroundColor: getColor('card') }]}>
        <View style={styles.progressCircleContainer}>
          <ProgressCircle
            progress={calculateOverallProgress()}
            size={120}
            strokeWidth={12}
            color={getColor('primary')}
          />
        </View>
        <View style={styles.overallStats}>
          <Text style={[styles.overallProgress, { color: getColor('text.primary') }]}>{calculateOverallProgress()}%</Text>
          <Text style={[styles.overallLabel, { color: getColor('primary') }]}>Overall Completion</Text>
          <Text style={[styles.goalCountText, { color: getColor('text.secondary') }]}>{goals.length} Active Goals</Text>
        </View>
      </View>

      <View style={[styles.tabsContainer, { backgroundColor: getColor('card') }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'overview' && { backgroundColor: getColor('button.primary') }
          ]}
          onPress={() => setActiveTab('overview')}
        >
          <Text
            style={[
              styles.tabText,
              { color: getColor('text.secondary') },
              activeTab === 'overview' && { color: getColor('primary') }
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'categories' && { backgroundColor: getColor('button.primary') }
          ]}
          onPress={() => setActiveTab('categories')}
        >
          <Text
            style={[
              styles.tabText,
              { color: getColor('text.secondary') },
              activeTab === 'categories' && { color: getColor('primary') }
            ]}
          >
            By Category
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' ? (
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: getColor('card') }]}>
            <View style={[styles.statIconContainer, { backgroundColor: getColor('status.success') }]}>
              <Award size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.statValue, { color: getColor('text.primary') }]}>{completeGoalsCount}</Text>
            <Text style={[styles.statLabel, { color: getColor('text.secondary') }]}>Completed</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: getColor('card') }]}>
            <View style={[styles.statIconContainer, { backgroundColor: getColor('primary') }]}>
              <TrendingUp size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.statValue, { color: getColor('text.primary') }]}>{inProgressGoalsCount}</Text>
            <Text style={[styles.statLabel, { color: getColor('text.secondary') }]}>In Progress</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: getColor('card') }]}>
            <View style={[styles.statIconContainer, { backgroundColor: getColor('text.secondary') }]}>
              <CalendarDays size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.statValue, { color: getColor('text.primary') }]}>{notStartedGoalsCount}</Text>
            <Text style={[styles.statLabel, { color: getColor('text.secondary') }]}>Not Started</Text>
          </View>
        </View>
      ) : (
        <View style={styles.categoriesContainer}>
          {categoryProgressData.length > 0 ? (
            categoryProgressData.map(({ category, progress, count }) => (
              <View key={category} style={[styles.categoryCard, { backgroundColor: getColor('card') }]}>
                <View style={styles.categoryHeader}>
                  <View 
                    style={[
                      styles.categoryIcon, 
                      { backgroundColor: getCategoryColor(category) }
                    ]}
                  >
                    {getCategoryIcon(category)}
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryName, { color: getColor('text.primary') }]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <Text style={[styles.categoryCount, { color: getColor('text.secondary') }]}>{count} goals</Text>
                  </View>
                  <ProgressCircle
                    progress={progress}
                    size={50}
                    strokeWidth={5}
                    color={getCategoryColor(category)}
                    backgroundColor={getColor('border')}
                  />
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: getColor('card') }]}>
              <Text style={[styles.emptyStateText, { color: getColor('text.secondary') }]}>
                No goal categories to display yet
              </Text>
            </View>
          )}
        </View>
      )}
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
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  overallProgressCard: {
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressCircleContainer: {
    marginRight: 24,
  },
  overallStats: {
    flex: 1,
  },
  overallProgress: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    marginBottom: 4,
  },
  overallLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  goalCountText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 100,
    marginBottom: 24,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 100,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  categoryCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  emptyState: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
});