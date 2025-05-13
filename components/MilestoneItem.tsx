import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Trash2 } from 'lucide-react-native';
import { Milestone } from '@/types/goal';

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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkContainer}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        {milestone.completed ? (
          <CheckCircle size={24} color={color} />
        ) : (
          <Circle size={24} color="#94A3B8" />
        )}
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            milestone.completed && styles.completedTitle,
          ]}
        >
          {milestone.title}
        </Text>
        
        {milestone.description && (
          <Text
            style={[
              styles.description,
              milestone.completed && styles.completedDescription,
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
        <Trash2 size={18} color="#94A3B8" />
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
    borderBottomColor: '#E2E8F0',
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
    color: '#1E293B',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  deleteButton: {
    padding: 8,
  },
});