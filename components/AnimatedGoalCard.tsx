import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { format } from 'date-fns';
import { Goal } from '@/types/goal';
import { Settings2, ChevronRight, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

import AnimatedProgressCircle from './AnimatedProgressCircle';
import { daysRemaining, formDateTime } from '@/utils';

interface GoalCardProps {
  goal: Goal;
  onPress?: () => void;
  index: number;
}

export default function AnimatedGoalCard({ goal, onPress, index }: GoalCardProps) {
  const router = useRouter();
  const { getColor } = useTheme();

  const handlePressIn = () => {
  };

  const handlePressOut = () => {
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: '/(goalDetails)/[id]',
        params: { id: goal.id }
      });
    }
  };

  const dayRemaing = daysRemaining(goal);
  return (
    <View
      style={[styles.cardContainer, { backgroundColor: getColor('card') }]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
      >
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
              <AnimatedProgressCircle
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
                  Target: {formDateTime(goal)}
                </Text>
              </View>

              <View style={styles.milestoneInfo}>
                <Text style={[styles.milestoneText, { color: getColor('text.secondary') }]}>
                  {goal.milestones.filter(m => m.completed).length} of {goal.milestones.length} milestones completed
                </Text>
              </View>

              <View style={styles.remainingContainer}>
                <Text style={[styles.remainingText, { color: goal.color }]}>
                  {dayRemaing} days remaining
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
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    marginBottom: 16,
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
  touchable: {
    flexDirection: 'row',
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
    fontFamily: 'Inter-Bold',
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