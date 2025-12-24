
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  targetRole: string;
  skills: string[];
  graduationYear: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface RoadmapNode {
  id: string;
  label: string;
  order: number;
  mandatory: boolean;
  description?: string; // Optional field for UI richness
}

export interface RoadmapSection {
  section_name: string;
  learning_stage: string;
  nodes: RoadmapNode[];
}

export interface RoadmapData {
  role: string;
  roadmap_style: string;
  sections: RoadmapSection[];
  dependencies: { from: string; to: string }[];
  learning_notes: {
    order_not_strict: boolean;
    beginner_friendly: boolean;
  };
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

export interface PrepPlan {
  dailyPlan: string;
  milestones: string[];
  riskAlerts: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ATSAnalysis {
  ats_score: number;
  ats_summary: {
    strengths: string[];
    weaknesses: string[];
    quick_fixes: string[];
  };
  bullet_improvements: {
    original: string;
    improved: string;
    keywords_added: string[];
    ats_reasoning: string;
  }[];
  skill_gap_analysis: {
    high_priority: string[];
    medium_priority: string[];
    optional: string[];
  };
  recommended_template: {
    template_name: string;
    best_for_roles: string[];
    why_it_works_for_ats: string;
  };
  generated_resume: {
    sections: {
      summary: string;
      experience: string[];
      projects: string[];
      skills: string[];
      education: string[];
    };
  };
}
