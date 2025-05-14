import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Goal, Milestone } from '@/types/goal';
import { ref, set, onValue, remove, Database, get } from 'firebase/database';
import { auth, db } from '@/config/firebase';
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

    const goalsRef = ref(db, `users/${user.uid}/goals`);
    console.log("Setting up goals listener for user:", user.uid);

    // Listen for real-time updates
    const unsubscribe = onValue(goalsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        console.log("Firebase data received:", data);

        if (data) {
          // Convert the object to an array and parse dates
          const goalsArray = Object.entries(data).map(([id, goal]: [string, any]) => ({
            ...goal,
            id,
            target: new Date(goal.target),
            createdAt: new Date(goal.createdAt),
            milestones: goal.milestones || []
          })) as Goal[];

          console.log("Processed goals array:", goalsArray);
          setGoals(goalsArray);
        } else {
          console.log("No goals data found");
          setGoals([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error processing goals data:", err);
        setError("Failed to load goals");
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Firebase error:", error);
      setError("Failed to connect to database");
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up goals listener");
      unsubscribe();
    };
  }, [user]);

  const addGoal = async (goal: Goal) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const goalRef = ref(db, `users/${user.uid}/goals/${goal.id}`);
      await set(goalRef, {
        ...goal,
        target: goal.target.toISOString(),
        createdAt: goal.createdAt.toISOString()
      });
    } catch (err) {
      console.error("Error adding goal:", err);
      throw err;
    }
  };

  const updateGoal = async (goalId: string, updatedGoal: Partial<Goal>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const goalRef = ref(db, `users/${user.uid}/goals/${goalId}`);
      const currentGoal = goals.find(g => g.id === goalId);
      if (!currentGoal) throw new Error("Goal not found");

      const updatedData = {
        ...currentGoal,
        ...updatedGoal,
        target: updatedGoal.target ? updatedGoal.target.toISOString() : currentGoal.target.toISOString(),
        createdAt: currentGoal.createdAt.toISOString()
      };

      await set(goalRef, updatedData);
    } catch (err) {
      console.error("Error updating goal:", err);
      throw err;
    }
  };

  const deleteGoal = async (goalId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const goalRef = ref(db, `users/${user.uid}/goals/${goalId}`);
    await remove(goalRef);
  };

  const toggleMilestoneCompleted = async (goalId: string, milestoneId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map((milestone) =>
      milestone.id === milestoneId
        ? { ...milestone, completed: !milestone.completed }
        : milestone
    );

    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const totalCount = updatedMilestones.length;
    const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const goalRef = ref(db, `users/${user.uid}/goals/${goalId}`);
    await set(goalRef, {
      ...goal,
      milestones: updatedMilestones,
      progress: newProgress
    });
  };

  const addMilestone = async (goalId: string, milestone: Milestone) => {
    const user = auth.currentUser;
    if (!user) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = [...goal.milestones, milestone];
    const goalRef = ref(db, `users/${user.uid}/goals/${goalId}`);
    await set(goalRef, { ...goal, milestones: updatedMilestones });
  };

  const deleteMilestone = async (goalId: string, milestoneId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.filter(
      (milestone) => milestone.id !== milestoneId
    );
    const goalRef = ref(db, `users/${user.uid}/goals/${goalId}`);
    await set(goalRef, { ...goal, milestones: updatedMilestones });
  };

  const updateMilestone = async (
    goalId: string,
    milestoneId: string,
    updatedMilestone: Partial<Milestone>
  ) => {
    const user = auth.currentUser;
    if (!user) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map((milestone) =>
      milestone.id === milestoneId
        ? { ...milestone, ...updatedMilestone }
        : milestone
    );
    const goalRef = ref(db, `users/${user.uid}/goals/${goalId}`);
    await set(goalRef, { ...goal, milestones: updatedMilestones });
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
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};