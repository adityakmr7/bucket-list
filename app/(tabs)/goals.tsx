import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useGoals } from '@/context/GoalContext';
import AnimatedGoalCard from '@/components/AnimatedGoalCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react-native';
import CategoryPicker from '@/components/CategoryPicker';
import { GoalCategory } from '@/types/goal';
import { useTheme } from '@/context/ThemeContext';

export default function GoalsScreen() {
  const { goals } = useGoals();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'progress'>('date');
  const { getColor } = useTheme();

  // Filter goals based on search and category
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? goal.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Sort goals
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.target).getTime() - new Date(b.target).getTime();
    } else {
      return b.progress - a.progress;
    }
  });

  return (
    <View style={[styles.container, { backgroundColor: getColor('background') }]}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { 
          backgroundColor: getColor('card'),
          borderColor: getColor('border')
        }]}>
          <Search size={20} color={getColor('text.secondary')} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: getColor('text.primary') }]}
            placeholder="Search goals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={getColor('text.secondary')}
          />
        </View>
        <TouchableOpacity style={[styles.filterButton, { 
          backgroundColor: getColor('card'),
          borderColor: getColor('border')
        }]}>
          <SlidersHorizontal size={20} color={getColor('primary')} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <CategoryPicker
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            if (selectedCategory === category) {
              setSelectedCategory(null);
            } else {
              setSelectedCategory(category);
            }
          }}
        />
      </View>

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: getColor('text.secondary') }]}>Sort by:</Text>
        <TouchableOpacity
          style={[
            styles.sortButton,
            { backgroundColor: getColor('button.primary') },
            sortBy === 'date' && { backgroundColor: getColor('button.primary') }
          ]}
          onPress={() => setSortBy('date')}
        >
          <Text
            style={[
              styles.sortButtonText,
              { color: getColor('text.secondary') },
              sortBy === 'date' && { color: getColor('primary') }
            ]}
          >
            Deadline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            { backgroundColor: getColor('button.primary') },
            sortBy === 'progress' && { backgroundColor: getColor('button.primary') }
          ]}
          onPress={() => setSortBy('progress')}
        >
          <Text
            style={[
              styles.sortButtonText,
              { color: getColor('text.secondary') },
              sortBy === 'progress' && { color: getColor('primary') }
            ]}
          >
            Progress
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.goalsContainer}
        contentContainerStyle={styles.goalsContent}
        showsVerticalScrollIndicator={false}
      >
        {sortedGoals.length > 0 ? (
          sortedGoals.map((goal, index) => (
            <AnimatedGoalCard key={goal.id} goal={goal} index={index} />
          ))
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: getColor('card') }]}>
            <Text style={[styles.emptyTitle, { color: getColor('text.primary') }]}>No goals found</Text>
            <Text style={[styles.emptyDescription, { color: getColor('text.secondary') }]}>
              {searchQuery || selectedCategory
                ? "Try adjusting your filters or search terms"
                : "Create a new goal by tapping the '+' tab"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    height: 44,
  },
  filterButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  filterContainer: {
    marginBottom: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginRight: 8,
  },
  sortButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  goalsContainer: {
    flex: 1,
  },
  goalsContent: {
    padding: 16,
  },
  emptyContainer: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});