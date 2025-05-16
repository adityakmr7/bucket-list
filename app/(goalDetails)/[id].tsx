import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGoals } from '@/context/GoalContext';
import ProgressCircle from '@/components/ProgressCircle';
import MilestoneItem from '@/components/MilestoneItem';
import { Calendar, Plus, Target } from 'lucide-react-native';
import { format } from 'date-fns';
import { Milestone } from '@/types/goal';

export default function GoalDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { goals, toggleMilestoneCompleted, addMilestone, deleteMilestone, updateGoal } = useGoals();
  const goal = goals.find(g => g.id === id);

  const [newMilestone, setNewMilestone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(goal?.title || '');
  const [editedDescription, setEditedDescription] = useState(goal?.description || '');

  console.log("gpal", goal);
  if (!goal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Goal not found</Text>
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: goal.color }]}>
          <Text style={styles.categoryText}>
            {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
          </Text>
        </View>

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Goal title"
            />
            <TextInput
              style={[styles.editInput, styles.editTextArea]}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder="Goal description"
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveEdits}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.title}>{goal.title}</Text>
            <Text style={styles.description}>{goal.description}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit Goal</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.progressSection}>
        <ProgressCircle
          progress={goal.progress}
          size={120}
          strokeWidth={12}
          color={goal.color}
        />
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>{goal.progress}% Complete</Text>
          <View style={styles.dateInfo}>
            <Calendar size={16} color="#64748B" />
            <Text style={styles.dateText}>
              Target: {format(new Date(goal.target), 'MMM d, yyyy')}
            </Text>
          </View>
          <Text style={[styles.remainingText, { color: goal.color }]}>
            {daysRemaining()} days remaining
          </Text>
        </View>
      </View>

      <View style={styles.milestonesSection}>
        <Text style={styles.sectionTitle}>Milestones</Text>

        <View style={styles.addMilestoneContainer}>
          <TextInput
            style={styles.milestoneInput}
            value={newMilestone}
            onChangeText={setNewMilestone}
            placeholder="Add a new milestone"
            placeholderTextColor="#94A3B8"
            onSubmitEditing={handleAddMilestone}
          />
          <TouchableOpacity
            style={styles.addButton}
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
              <Target size={40} color="#94A3B8" />
              <Text style={styles.emptyStateText}>
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    color: '#1E293B',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  editButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
  },
  editContainer: {
    gap: 12,
  },
  editInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
  },
  editTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
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
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  progressInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  progressText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 8,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  remainingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  milestonesSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  addMilestoneContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  milestoneInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestonesList: {
    backgroundColor: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 24,
  },
});