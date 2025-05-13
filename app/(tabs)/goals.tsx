import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useGoals } from '@/context/GoalContext';
import AnimatedGoalCard from '@/components/AnimatedGoalCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react-native';
import CategoryPicker from '@/components/CategoryPicker';
import { GoalCategory } from '@/types/goal';
import Animated, { 
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';

export default function GoalsScreen() {
  const { goals } = useGoals();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'progress'>('date');

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
    <View style={styles.container}>
      <Animated.View 
        entering={SlideInRight.duration(500)}
        style={styles.searchContainer}
      >
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search goals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={20} color="#3B82F6" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View 
        entering={SlideInRight.delay(100).duration(500)}
        style={styles.filterContainer}
      >
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
      </Animated.View>

      <Animated.View 
        entering={SlideInRight.delay(200).duration(500)}
        style={styles.sortContainer}
      >
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'date' && styles.sortButtonActive,
          ]}
          onPress={() => setSortBy('date')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === 'date' && styles.sortButtonTextActive,
            ]}
          >
            Deadline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'progress' && styles.sortButtonActive,
          ]}
          onPress={() => setSortBy('progress')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === 'progress' && styles.sortButtonTextActive,
            ]}
          >
            Progress
          </Text>
        </TouchableOpacity>
      </Animated.View>

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
          <Animated.View 
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.emptyContainer}
          >
            <Text style={styles.emptyTitle}>No goals found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery || selectedCategory
                ? "Try adjusting your filters or search terms"
                : "Create a new goal by tapping the '+' tab"}
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
    height: 44,
  },
  filterButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#64748B',
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#EFF6FF',
  },
  sortButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748B',
  },
  sortButtonTextActive: {
    color: '#3B82F6',
  },
  goalsContainer: {
    flex: 1,
  },
  goalsContent: {
    padding: 16,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});