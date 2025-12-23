
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  targetRole: string;
  skills: string[];
  graduationYear: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  skills: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  eligibleYear: number;
  isVerified: boolean;
  matchScore: number;
}

export interface RoadmapNode {
  topic: string;
  resources: { name: string; url: string }[];
  status: 'pending' | 'completed';
}

export interface PrepPlan {
  dailyPlan: string;
  milestones: string[];
  riskAlerts: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
