// contexts/GoalProvider.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Goal, Milestone } from '@/types/goal';
import { supabase } from '@/utils/supabase';
import { useAuth } from './AuthProvider';

interface GoalContextType {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goalId: string, updatedGoal: Partial<Goal>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  toggleMilestoneCompleted: (goalId: string, milestoneId: string) => Promise<void>;
  addMilestone: (goalId: string, milestone: Milestone) => Promise<void>;
  deleteMilestone: (goalId: string, milestoneId: string) => Promise<void>;
  updateMilestone: (goalId: string, milestoneId: string, updatedMilestone: Partial<Milestone>) => Promise<void>;
  getGoalProgress: (goalId: string) => number;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

interface GoalProviderProps {
  children: ReactNode;
}

export const GoalProvider = ({ children }: GoalProviderProps) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    const fetchGoals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*, milestones(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Supabase error:', error);
        setError('Failed to load goals');
      } else {

        const goalsData = data.map((goal) => ({
          ...goal,
          target: new Date(goal.target),
          created_at: new Date(goal.created_at),
          milestones: goal.milestones || [],
        }));
        setGoals(goalsData);
        setError(null);
      }
      setLoading(false);
    };

    fetchGoals();
  }, [user]);

  const addGoal = async (goal: Goal) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error, data: goalData } = await supabase.from('goals').insert({
        user_id: user.id,
        title: goal.title,
        target: goal.target.toISOString(),
        created_at: goal.createdAt.toISOString(),
        progress: goal.progress,
        category: goal.category,
        color: goal.color,
      }).select().single();


      if (goal.milestones && goal.milestones.length > 0) {
        const milestonesWithGoalId = goal.milestones.map((m) => ({
          goal_id: goalData.id,
          title: m.title,
          description: m.description,
          completed: m.completed ?? false,
        }));

        const { error: milestoneError } = await supabase
          .from('milestones')
          .insert(milestonesWithGoalId);

        if (milestoneError) throw milestoneError;
      }

      if (error) throw error;
    } catch (err) {
      console.error('Error adding goal:', err);
      throw err;
    }
  };

  const updateGoal = async (goalId: string, updatedGoal: Partial<Goal>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('goals')
        .update({
          ...updatedGoal,
          target: updatedGoal.target?.toISOString(),
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating goal:', err);
      throw err;
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting goal:', err);
      throw err;
    }
  };

  const toggleMilestoneCompleted = async (goalId: string, milestoneId: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const goal = goals.find((g) => g.id === goalId);
      if (!goal) throw new Error('Goal not found');

      const milestone = goal.milestones.find((m) => m.id === milestoneId);
      if (!milestone) throw new Error('Milestone not found');

      const updatedCompleted = !milestone.completed;

      const { error } = await supabase
        .from('milestones')
        .update({ completed: updatedCompleted })
        .eq('id', milestoneId);

      if (error) throw error;

      // Update progress
      const updatedMilestones = goal.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: updatedCompleted } : m
      );
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const totalCount = updatedMilestones.length;
      const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      const { error: goalError } = await supabase
        .from('goals')
        .update({ progress: newProgress })
        .eq('id', goalId);

      if (goalError) throw goalError;
    } catch (err) {
      console.error('Error toggling milestone:', err);
      throw err;
    }
  };

  const addMilestone = async (goalId: string, milestone: Milestone) => {
    try {
      if (!user) throw new Error('User not authenticated');
      console.log("addMilestone", {
        goalId,
        milestone
      })
      const { error } = await supabase.from('milestones').insert({
        goal_id: goalId,
        title: milestone.title,
        description: milestone.description,
        completed: milestone.completed,
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error adding milestone:', err);
      throw err;
    }
  };

  const deleteMilestone = async (goalId: string, milestoneId: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', milestoneId)
        .eq('goal_id', goalId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting milestone:', err);
      throw err;
    }
  };

  const updateMilestone = async (
    goalId: string,
    milestoneId: string,
    updatedMilestone: Partial<Milestone>
  ) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('milestones')
        .update(updatedMilestone)
        .eq('id', milestoneId)
        .eq('goal_id', goalId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating milestone:', err);
      throw err;
    }
  };

  const getGoalProgress = (goalId: string): number => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return 0;

    const totalMilestones = goal.milestones.length;
    if (totalMilestones === 0) return 0;

    const completedMilestones = goal.milestones.filter((m) => m.completed).length;
    return Math.round((completedMilestones / totalMilestones) * 100);
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        loading,
        error,
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
    throw new Error('useGoals must be used within ');
  }
  return context;
}


