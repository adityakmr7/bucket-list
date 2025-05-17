import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { GoalCategory, CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/goal';
import { BookOpen, Briefcase, DollarSign, Dumbbell, Heart, HeartPulse, MapPin, PenTool, User } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface CategoryPickerProps {
  selectedCategory: GoalCategory | null;
  onSelectCategory: (category: GoalCategory) => void;
}

export default function CategoryPicker({
  selectedCategory,
  onSelectCategory,
}: CategoryPickerProps) {
  const { getColor } = useTheme();
  const categories: { value: GoalCategory; label: string }[] = [
    { value: 'fitness', label: 'Fitness' },
    { value: 'career', label: 'Career' },
    { value: 'education', label: 'Education' },
    { value: 'finance', label: 'Finance' },
    { value: 'personal', label: 'Personal' },
    { value: 'travel', label: 'Travel' },
    { value: 'creative', label: 'Creative' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'health', label: 'Health' },
  ];

  const getIcon = (category: GoalCategory) => {
    switch (category) {
      case 'fitness':
        return <Dumbbell size={20} color="#FFFFFF" />;
      case 'career':
        return <Briefcase size={20} color="#FFFFFF" />;
      case 'education':
        return <BookOpen size={20} color="#FFFFFF" />;
      case 'finance':
        return <DollarSign size={20} color="#FFFFFF" />;
      case 'personal':
        return <User size={20} color="#FFFFFF" />;
      case 'travel':
        return <MapPin size={20} color="#FFFFFF" />;
      case 'creative':
        return <PenTool size={20} color="#FFFFFF" />;
      case 'relationships':
        return <Heart size={20} color="#FFFFFF" />;
      case 'health':
        return <HeartPulse size={20} color="#FFFFFF" />;
      default:
        return <User size={20} color="#FFFFFF" />;
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.value}
          style={[
            styles.categoryItem,
            {
              backgroundColor:
                selectedCategory === category.value
                  ? CATEGORY_COLORS[category.value]
                  : getColor('button.primary'),
            },
          ]}
          onPress={() => onSelectCategory(category.value)}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  selectedCategory === category.value
                    ? '#FFFFFF30'
                    : CATEGORY_COLORS[category.value],
              },
            ]}
          >
            {getIcon(category.value)}
          </View>
          <Text
            style={[
              styles.categoryText,
              {
                color:
                  selectedCategory === category.value ? '#FFFFFF' : getColor('text.secondary'),
              },
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    marginRight: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});