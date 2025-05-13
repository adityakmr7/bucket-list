export type GoalCategory = 
  | 'fitness' 
  | 'career' 
  | 'education' 
  | 'finance' 
  | 'personal' 
  | 'travel' 
  | 'creative' 
  | 'relationships'
  | 'health';

export type ReminderFrequency = 'daily' | 'weekly' | 'monthly' | 'none';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  color: string;
  target: Date;
  createdAt: Date;
  completedAt?: Date;
  progress: number;
  milestones: Milestone[];
  reminderFrequency: ReminderFrequency;
  notes?: string;
  imageUrl?: string;
}

export const CATEGORY_COLORS = {
  fitness: '#4ECDC4',
  career: '#FF6B6B',
  education: '#3B82F6',
  finance: '#10B981',
  personal: '#8B5CF6',
  travel: '#F59E0B',
  creative: '#FFD166',
  relationships: '#EC4899',
  health: '#EF4444'
};

export const CATEGORY_ICONS = {
  fitness: 'dumbbell',
  career: 'briefcase',
  education: 'book-open',
  finance: 'dollar-sign',
  personal: 'user',
  travel: 'map-pin',
  creative: 'pen-tool',
  relationships: 'heart',
  health: 'heart-pulse'
};