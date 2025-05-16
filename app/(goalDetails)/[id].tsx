import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGoals } from '@/context/GoalContext';
import ProgressCircle from '@/components/ProgressCircle';
import MilestoneItem from '@/components/MilestoneItem';
import { Calendar, Plus, Target } from 'lucide-react-native';
import { format } from 'date-fns';
import { Milestone } from '@/types/goal';
import { useTheme } from '@/context/ThemeContext';

export default function GoalDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { goals, toggleMilestoneCompleted, addMilestone, deleteMilestone, updateGoal } = useGoals();
  const { getColor } = useTheme();
  const goal = goals.find(g => g.id === id);

  const [newMilestone, setNewMilestone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(goal?.title || '');
  const [editedDescription, setEditedDescription] = useState(goal?.description || '');

  console.log("gpal", goal);
  if (!goal) {
    return (
      <View style={[styles.container, { backgroundColor: getColor('background') }]}>
        <Text style={[styles.errorText, { color: getColor('text.primary') }]}>Goal not found</Text>
      </View>
    );
  }

  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      const milestone: Milestone = {
        id: Date.now().toString(),
        title: newMilestone.trim(),
        completed: false,
      };
      addMilestone(goal.id, milestone);
      setNewMilestone('');
    }
  };

  const handleSaveEdits = () => {
    if (editedTitle.trim() && editedDescription.trim()) {
      updateGoal(goal.id, {
        title: editedTitle.trim(),
        description: editedDescription.trim(),
      });
      setIsEditing(false);
    }
  };

  const daysRemaining = () => {
    const today = new Date();
    const targetDate = new Date(goal.target);
    const diffTime = Math.abs(targetDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: getColor('background') }]}>
      <View style={[styles.header, { backgroundColor: getColor('card'), borderBottomColor: getColor('border') }]}>
        <View style={[styles.categoryBadge, { backgroundColor: goal.color }]}>
          <Text style={styles.categoryText}>
            {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
          </Text>
        </View>

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[styles.editInput, { 
                color: getColor('text.primary'),
                borderColor: getColor('border'),
                backgroundColor: getColor('background')
              }]}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Goal title"
              placeholderTextColor={getColor('text.secondary')}
            />
            <TextInput
              style={[styles.editInput, styles.editTextArea, { 
                color: getColor('text.primary'),
                borderColor: getColor('border'),
                backgroundColor: getColor('background')
              }]}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder="Goal description"
              placeholderTextColor={getColor('text.secondary')}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: getColor('primary') }]}
              onPress={handleSaveEdits}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={[styles.title, { color: getColor('text.primary') }]}>{goal.title}</Text>
            <Text style={[styles.description, { color: getColor('text.secondary') }]}>{goal.description}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={[styles.editButtonText, { color: getColor('primary') }]}>Edit Goal</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={[styles.progressSection, { 
        backgroundColor: getColor('card'),
        borderBottomColor: getColor('border')
      }]}>
        <ProgressCircle
          progress={goal.progress}
          size={120}
          strokeWidth={12}
          color={goal.color}
        />
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, { color: getColor('text.primary') }]}>{goal.progress}% Complete</Text>
          <View style={styles.dateInfo}>
            <Calendar size={16} color={getColor('text.secondary')} />
            <Text style={[styles.dateText, { color: getColor('text.secondary') }]}>
              Target: {format(new Date(goal.target), 'MMM d, yyyy')}
            </Text>
          </View>
          <Text style={[styles.remainingText, { color: goal.color }]}>
            {daysRemaining()} days remaining
          </Text>
        </View>
      </View>

      <View style={styles.milestonesSection}>
        <Text style={[styles.sectionTitle, { color: getColor('text.primary') }]}>Milestones</Text>

        <View style={styles.addMilestoneContainer}>
          <TextInput
            style={[styles.milestoneInput, { 
              color: getColor('text.primary'),
              borderColor: getColor('border'),
              backgroundColor: getColor('background')
            }]}
            value={newMilestone}
            onChangeText={setNewMilestone}
            placeholder="Add a new milestone"
            placeholderTextColor={getColor('text.secondary')}
            onSubmitEditing={handleAddMilestone}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: getColor('primary') }]}
            onPress={handleAddMilestone}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.milestonesList}>
          {goal.milestones.map((milestone) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              onToggle={() => toggleMilestoneCompleted(goal.id, milestone.id)}
              onDelete={() => deleteMilestone(goal.id, milestone.id)}
              color={goal.color}
            />
          ))}
          {goal.milestones.length === 0 && (
            <View style={styles.emptyState}>
              <Target size={40} color={getColor('text.secondary')} />
              <Text style={[styles.emptyStateText, { color: getColor('text.secondary') }]}>
                No milestones yet. Break down your goal into smaller, achievable steps.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  editButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  editContainer: {
    gap: 12,
  },
  editInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  editTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  progressSection: {
    flexDirection: 'row',
    padding: 16,
    marginTop: 8,
    borderBottomWidth: 1,
  },
  progressInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  progressText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 8,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  remainingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  milestonesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  addMilestoneContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  milestoneInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestonesList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});