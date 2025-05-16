import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { format } from 'date-fns';
import ProgressCircle from './ProgressCircle';
import { Goal } from '@/types/goal';
import { Settings2, ChevronRight, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { daysRemaining, formDateTime } from '@/utils';
import { useTheme } from '@/context/ThemeContext';

interface GoalCardProps {
  goal: Goal;
  onPress?: () => void;
}

export default function GoalCard({ goal, onPress }: GoalCardProps) {
  const router = useRouter();
  const { getColor } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to goal details
      router.push({
        pathname: '/(goalDetails)/[id]',
        params: { id: goal.id }
      });
    }
  };

  const remainingDay = daysRemaining(goal) || 0;
  return (
    <TouchableOpacity onPress={handlePress} style={[styles.cardContainer, { backgroundColor: getColor('card') }]}>
      <View style={[styles.colorBar, { backgroundColor: goal.color }]} />
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, { color: getColor('text.primary') }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {goal.title}
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => console.log('Edit goal')}
          >
            <Settings2 size={18} color={getColor('icon.primary')} />
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.description, { color: getColor('text.secondary') }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {goal.description}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.progressContainer}>
            <ProgressCircle
              progress={goal.progress}
              size={80}
              strokeWidth={8}
              color={goal.color}
              backgroundColor={getColor('border')}
            />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.dateContainer}>
              <Calendar size={16} color={getColor('icon.primary')} />
              <Text style={[styles.dateText, { color: getColor('text.secondary') }]}>
                Target: {formDateTime(goal) || ''}
              </Text>
            </View>

            <View style={styles.milestoneInfo}>
              <Text style={[styles.milestoneText, { color: getColor('text.secondary') }]}>
                {goal.milestones.filter(m => m.completed).length} of {goal.milestones.length} milestones completed
              </Text>
            </View>

            <View style={styles.remainingContainer}>
              <Text style={[styles.remainingText, { color: goal.color }]}>
                {remainingDay} days remaining
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: getColor('border') }]}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={handlePress}
          >
            <Text style={[styles.detailsText, { color: getColor('primary') }]}>View Details</Text>
            <ChevronRight size={16} color={getColor('primary')} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  colorBar: {
    width: 6,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    flex: 1,
  },
  settingsButton: {
    padding: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    marginLeft: 6,
  },
  milestoneInfo: {
    marginBottom: 8,
  },
  milestoneText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  remainingContainer: {
    marginTop: 4,
  },
  remainingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginRight: 4,
  },
});