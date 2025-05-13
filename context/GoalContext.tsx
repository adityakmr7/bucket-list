import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Goal, Milestone } from '@/types/goal';

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (goalId: string, updatedGoal: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  toggleMilestoneCompleted: (goalId: string, milestoneId: string) => void;
  addMilestone: (goalId: string, milestone: Milestone) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  updateMilestone: (goalId: string, milestoneId: string, updatedMilestone: Partial<Milestone>) => void;
  getGoalProgress: (goalId: string) => number;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

interface GoalProviderProps {
  children: ReactNode;
}

export const GoalProvider = ({ children }: GoalProviderProps) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Learn French',
      description: 'Become conversational in French within 1 year',
      category: 'education',
      color: '#FF6B6B',
      target: new Date('2024-12-31'),
      createdAt: new Date('2023-12-31'),
      progress: 25,
      milestones: [
        { id: '1-1', title: 'Learn 500 basic words', completed: true },
        { id: '1-2', title: 'Complete beginner course', completed: true },
        { id: '1-3', title: 'Have first conversation', completed: false },
        { id: '1-4', title: 'Read first book in French', completed: false },
      ],
      reminderFrequency: 'weekly',
    },
    {
      id: '2',
      title: 'Run a Marathon',
      description: 'Complete a full marathon',
      category: 'fitness',
      color: '#4ECDC4',
      target: new Date('2024-10-15'),
      createdAt: new Date('2023-10-15'),
      progress: 40,
      milestones: [
        { id: '2-1', title: 'Run 5K without stopping', completed: true },
        { id: '2-2', title: 'Complete a 10K race', completed: true },
        { id: '2-3', title: 'Run a half marathon', completed: false },
        { id: '2-4', title: 'Complete marathon training', completed: false },
      ],
      reminderFrequency: 'daily',
    },
    {
      id: '3',
      title: 'Write a Novel',
      description: 'Complete a 50,000 word fiction novel',
      category: 'creative',
      color: '#FFD166',
      target: new Date('2025-06-30'),
      createdAt: new Date('2023-07-01'),
      progress: 15,
      milestones: [
        { id: '3-1', title: 'Outline story and characters', completed: true },
        { id: '3-2', title: 'Write first chapter', completed: false },
        { id: '3-3', title: 'Complete first draft', completed: false },
        { id: '3-4', title: 'Edit and finalize manuscript', completed: false },
      ],
      reminderFrequency: 'weekly',
    },
  ]);

  const addGoal = (goal: Goal) => {
    setGoals((prevGoals) => [...prevGoals, goal]);
  };

  const updateGoal = (goalId: string, updatedGoal: Partial<Goal>) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId ? { ...goal, ...updatedGoal } : goal
      )
    );
  };

  const deleteGoal = (goalId: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
  };

  const toggleMilestoneCompleted = (goalId: string, milestoneId: string) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map((milestone) =>
            milestone.id === milestoneId
              ? { ...milestone, completed: !milestone.completed }
              : milestone
          );

          // Calculate new progress based on completed milestones
          const completedCount = updatedMilestones.filter(m => m.completed).length;
          const totalCount = updatedMilestones.length;
          const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return {
            ...goal,
            milestones: updatedMilestones,
            progress: newProgress
          };
        }
        return goal;
      })
    );
  };

  const addMilestone = (goalId: string, milestone: Milestone) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = [...goal.milestones, milestone];
          return { ...goal, milestones: updatedMilestones };
        }
        return goal;
      })
    );
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.filter(
            (milestone) => milestone.id !== milestoneId
          );
          return { ...goal, milestones: updatedMilestones };
        }
        return goal;
      })
    );
  };

  const updateMilestone = (
    goalId: string,
    milestoneId: string,
    updatedMilestone: Partial<Milestone>
  ) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map((milestone) =>
            milestone.id === milestoneId
              ? { ...milestone, ...updatedMilestone }
              : milestone
          );
          return { ...goal, milestones: updatedMilestones };
        }
        return goal;
      })
    );
  };

  const getGoalProgress = (goalId: string): number => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return 0;

    const totalMilestones = goal.milestones.length;
    if (totalMilestones === 0) return 0;

    const completedMilestones = goal.milestones.filter(m => m.completed).length;
    return Math.round((completedMilestones / totalMilestones) * 100);
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestoneCompleted,
        addMilestone,
        deleteMilestone,
        updateMilestone,
        getGoalProgress,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};