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
  Modal,
} from 'react-native';
import { useGoals } from '@/context/GoalContext';
import { useRouter } from 'expo-router';
import { GoalCategory, CATEGORY_COLORS } from '@/types/goal';
import { Calendar, Plus, Target } from 'lucide-react-native';
import CategoryPicker from '@/components/CategoryPicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '@/context/ThemeContext';

export default function AddGoalScreen() {
  const { addGoal } = useGoals();
  const router = useRouter();
  const { getColor } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory | null>(null);
  const [targetDate, setTargetDate] = useState<Date>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // Default to 30 days from now
  );
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [show, setShow] = useState(false);

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

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setTargetDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView style={[styles.container, { backgroundColor: getColor('background') }]} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: getColor('text.primary') }]}>Goal Title</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: getColor('card'),
              borderColor: getColor('border'),
              color: getColor('text.primary')
            }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter a clear, specific title"
            placeholderTextColor={getColor('text.secondary')}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: getColor('text.primary') }]}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, { 
              backgroundColor: getColor('card'),
              borderColor: getColor('border'),
              color: getColor('text.primary')
            }]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Why is this goal important to you?"
            placeholderTextColor={getColor('text.secondary')}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: getColor('text.primary') }]}>Category</Text>
          <CategoryPicker
            selectedCategory={category}
            onSelectCategory={setCategory}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: getColor('text.primary') }]}>Target Date</Text>
          <TouchableOpacity
            style={[styles.datePickerButton, { 
              backgroundColor: getColor('card'),
              borderColor: getColor('border')
            }]}
            onPress={showDatepicker}
          >
            <Calendar size={20} color={getColor('primary')} />
            <Text style={[styles.dateText, { color: getColor('text.primary') }]}>{formatDate(targetDate)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <View style={styles.milestonesHeader}>
            <Text style={[styles.label, { color: getColor('text.primary') }]}>Milestones</Text>
            <Text style={[styles.helperText, { color: getColor('text.secondary') }]}>Breaking your goal into steps</Text>
          </View>

          <View style={styles.milestoneInputContainer}>
            <TextInput
              style={[styles.milestoneInput, { 
                backgroundColor: getColor('card'),
                borderColor: getColor('border'),
                color: getColor('text.primary')
              }]}
              value={newMilestone}
              onChangeText={setNewMilestone}
              placeholder="Add a milestone"
              placeholderTextColor={getColor('text.secondary')}
              onSubmitEditing={handleAddMilestone}
            />
            <TouchableOpacity
              style={[styles.addMilestoneButton, { backgroundColor: getColor('primary') }]}
              onPress={handleAddMilestone}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={[styles.milestonesList, { 
            backgroundColor: getColor('card'),
            borderColor: getColor('border')
          }]}>
            {milestones.map((milestone) => (
              <View key={milestone.id} style={[styles.milestoneItem, { borderBottomColor: getColor('border') }]}>
                <View style={[styles.milestoneIconContainer, { backgroundColor: getColor('button.primary') }]}>
                  <Target size={16} color={getColor('primary')} />
                </View>
                <Text style={[styles.milestoneTitle, { color: getColor('text.primary') }]}>{milestone.title}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveMilestone(milestone.id)}
                  style={[styles.removeButton, { backgroundColor: getColor('button.primary') }]}
                >
                  <Text style={[styles.removeButtonText, { color: getColor('text.secondary') }]}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {milestones.length === 0 && (
              <Text style={[styles.noMilestonesText, { color: getColor('text.secondary') }]}>
                No milestones added yet. Break your goal into achievable steps.
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: getColor('primary') }]}
          onPress={handleCreateGoal}
        >
          <Text style={styles.createButtonText}>Create Goal</Text>
        </TouchableOpacity>
      </ScrollView>

      {show && (Platform.OS === 'ios' ? (
        <Modal
          transparent={true}
          animationType="slide"
          visible={show}
        >
          <View style={[styles.datePickerModalContainer, { backgroundColor: getColor('shadow') }]}>
            <View style={[styles.datePickerModal, { backgroundColor: getColor('card') }]}>
              <View style={[styles.datePickerHeader, { borderBottomColor: getColor('border') }]}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={[styles.datePickerCancelButton, { color: getColor('primary') }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.datePickerTitle, { color: getColor('text.primary') }]}>Select Date</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShow(false);
                  }}
                >
                  <Text style={[styles.datePickerDoneButton, { color: getColor('primary') }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                testID="dateTimePicker"
                value={targetDate}
                mode={mode}
                is24Hour={true}
                display="spinner"
                onChange={onChange}
                style={styles.datePickerIOS}
              />
            </View>
          </View>
        </Modal>
      ) : (
        <DateTimePicker
          testID="dateTimePicker"
          value={targetDate}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
          display="default"
        />
      ))}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 8,
  },
  helperText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginRight: 8,
  },
  addMilestoneButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestonesList: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  milestoneIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneTitle: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  noMilestonesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 8,
  },
  createButton: {
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
  datePickerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  datePickerModal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  datePickerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  datePickerCancelButton: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  datePickerDoneButton: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  datePickerIOS: {
    height: 220,
    paddingLeft: 32 * 2,
    width: '100%'
  },
});