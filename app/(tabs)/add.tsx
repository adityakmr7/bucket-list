import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useGoals } from '@/context/GoalContext';
import { useRouter } from 'expo-router';
import { GoalCategory, CATEGORY_COLORS } from '@/types/goal';
import { Calendar, Plus, Target } from 'lucide-react-native';
import CategoryPicker from '@/components/CategoryPicker';

export default function AddGoalScreen() {
  const { addGoal } = useGoals();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory | null>(null);
  const [targetDate, setTargetDate] = useState<Date>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // Default to 30 days from now
  );
  const [milestones, setMilestones] = useState<
    { id: string; title: string; completed: boolean }[]
  >([]);
  const [newMilestone, setNewMilestone] = useState('');

  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      setMilestones((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          title: newMilestone.trim(),
          completed: false,
        },
      ]);
      setNewMilestone('');
    }
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((milestone) => milestone.id !== id));
  };

  const handleCreateGoal = () => {
    if (!title.trim() || !description.trim() || !category) {
      // Show validation error
      console.log('Please fill out all required fields');
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      color: CATEGORY_COLORS[category],
      target: targetDate,
      createdAt: new Date(),
      progress: 0,
      milestones,
      reminderFrequency: 'weekly' as const,
    };

    addGoal(newGoal);
    router.push('/goals');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Goal Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter a clear, specific title"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Why is this goal important to you?"
            placeholderTextColor="#94A3B8"
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <CategoryPicker
            selectedCategory={category}
            onSelectCategory={setCategory}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Target Date</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => {
              // In a real app, we'd open a date picker here
              console.log('Open date picker');
            }}
          >
            <Calendar size={20} color="#3B82F6" />
            <Text style={styles.dateText}>{formatDate(targetDate)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <View style={styles.milestonesHeader}>
            <Text style={styles.label}>Milestones</Text>
            <Text style={styles.helperText}>Breaking your goal into steps</Text>
          </View>

          <View style={styles.milestoneInputContainer}>
            <TextInput
              style={styles.milestoneInput}
              value={newMilestone}
              onChangeText={setNewMilestone}
              placeholder="Add a milestone"
              placeholderTextColor="#94A3B8"
              onSubmitEditing={handleAddMilestone}
            />
            <TouchableOpacity
              style={styles.addMilestoneButton}
              onPress={handleAddMilestone}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.milestonesList}>
            {milestones.map((milestone) => (
              <View key={milestone.id} style={styles.milestoneItem}>
                <View style={styles.milestoneIconContainer}>
                  <Target size={16} color="#3B82F6" />
                </View>
                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveMilestone(milestone.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {milestones.length === 0 && (
              <Text style={styles.noMilestonesText}>
                No milestones added yet. Break your goal into achievable steps.
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateGoal}
        >
          <Text style={styles.createButtonText}>Create Goal</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
  },
  helperText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  milestonesHeader: {
    marginBottom: 8,
  },
  milestoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
    marginRight: 8,
  },
  addMilestoneButton: {
    backgroundColor: '#3B82F6',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestonesList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  milestoneIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneTitle: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E293B',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748B',
  },
  noMilestonesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 8,
  },
  createButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  createButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});