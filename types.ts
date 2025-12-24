
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
  type: 'Internship' | 'Co-op' | 'Full-time' | 'Remote';
  location: string;
  stipend: string;
  skills: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Stretch';
  eligibleYear: number[]; // Changed to array for multiple batches
  postedDate: string;
  deadline: string;
  isVerified: boolean;
  verificationSource?: string; // e.g. "Placement Cell"
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
  ats_score: {
    total: number;
    breakdown: {
      keyword_relevance: number;
      formatting: number;
      content_strength: number;
      role_alignment: number;
      completeness: number;
    };
    summary: string;
  };
  keyword_analysis: {
    missing_critical: string[];
    underused: string[];
    irrelevant: string[];
    classification: {
      technical: string[];
      tools: string[];
      soft_skills: string[];
      role_specific: string[];
    };
  };
  bullet_improvements: {
    original: string;
    improved: string;
    improvement_type: string; // e.g. "Action Verb", "Quantified Impact"
  }[];
  formatting_feedback: {
    issues: string[];
    suggestions: string[];
  };
  role_specific_improvements: {
    skills_to_add: string[];
    sections_to_enhance: string[];
  };
  verdict: {
    estimated_post_fix_score: number;
    status: 'Not Ready' | 'Partially Ready' | 'Interview Ready';
    checklist: string[];
  };
}
