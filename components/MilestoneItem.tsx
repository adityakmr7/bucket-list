import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Trash2 } from 'lucide-react-native';
import { Milestone } from '@/types/goal';
import { useTheme } from '@/context/ThemeContext';

interface MilestoneItemProps {
  milestone: Milestone;
  onToggle: () => void;
  onDelete: () => void;
  color?: string;
}

export default function MilestoneItem({
  milestone,
  onToggle,
  onDelete,
  color = '#3B82F6',
}: MilestoneItemProps) {
  const { getColor } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: getColor('border') }]}>
      <TouchableOpacity
        style={styles.checkContainer}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        {milestone.completed ? (
          <CheckCircle size={24} color={color} />
        ) : (
          <Circle size={24} color={getColor('icon.primary')} />
        )}
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            { color: getColor('text.primary') },
            milestone.completed && { color: getColor('text.secondary') }
          ]}
        >
          {milestone.title}
        </Text>

        {milestone.description && (
          <Text
            style={[
              styles.description,
              { color: getColor('text.secondary') },
              milestone.completed && { color: getColor('text.secondary') }
            ]}
            numberOfLines={2}
          >
            {milestone.description}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Trash2 size={18} color={getColor('icon.primary')} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  checkContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
  },
});