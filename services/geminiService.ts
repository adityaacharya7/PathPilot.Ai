
import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapNode, PrepPlan, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getProfilePrompt = (profile: UserProfile) => `
User Profile:
- Name: ${profile.name}
- Target Role: ${profile.targetRole}
- Skills: ${profile.skills.join(', ')}
- Current Level: ${profile.currentLevel}
- Graduation Year: ${profile.graduationYear}
`;

export const getCareerAdvice = async (history: { role: string; content: string }[], profile: UserProfile) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are PathPilot AI, a personalized career advisor. ${getProfilePrompt(profile)}
      Help the student with placement strategies and skill identification. Be encouraging, specific, and professional.`,
    }
  });

  const lastMessage = history[history.length - 1].content;
  const result = await chat.sendMessage({ message: lastMessage });
  return result.text;
};

// Fixed: Changed signature to accept targetRole, days, and currentLevel directly to match PrepPlanner usage
export const generatePrepPlan = async (targetRole: string, days: number, currentLevel: string): Promise<PrepPlan> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a placement preparation plan for a student targeting a ${targetRole} role in ${days} days. 
    The student's current level is ${currentLevel}.
    Include a daily routine, weekly milestones, and potential risk alerts based on their current level.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dailyPlan: { type: Type.STRING },
          milestones: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["dailyPlan", "milestones", "riskAlerts"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const improveResumeBullet = async (bullet: string, role: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Rewrite this resume bullet for a ${role} role using the STAR method (Situation, Task, Action, Result). Make it high-impact and ATS-optimized: "${bullet}"`,
  });
  return response.text || bullet;
};

// Fixed: Changed signature to accept targetRole string to match Roadmap component usage
export const generateRoadmap = async (targetRole: string): Promise<RoadmapNode[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a step-by-step skill roadmap to become a ${targetRole}. Focus on core competencies, industry-standard tools, and project-based learning.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};
