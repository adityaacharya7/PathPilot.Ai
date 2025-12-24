
import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapData, PrepPlan, UserProfile, ATSAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDynamicRoadmap = async (
  role: string
): Promise<RoadmapData> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert curriculum architect. Generate a complete skill roadmap for the job role: "${role}", inspired by roadmap.sh.

    This roadmap must:
    - Match industry expectations
    - Be beginner-friendly but complete
    - Follow clear learning progression
    - Be structured as a visual roadmap / mind map
    
    OUTPUT FORMAT (STRICT — JSON ONLY):
    {
      "role": "${role}",
      "roadmap_style": "roadmap.sh",
      "sections": [
        {
          "section_name": "Internet",
          "learning_stage": "Early",
          "nodes": [
            {
              "id": "internet_basics",
              "label": "How the Internet Works",
              "order": 1,
              "mandatory": true,
              "description": "Short reasoning why this matters."
            }
          ]
        }
      ],
      "dependencies": [
        { "from": "node_id", "to": "node_id" }
      ],
      "learning_notes": {
        "order_not_strict": true,
        "beginner_friendly": true
      }
    }
    
    Ensure you include mandatory sections like Foundations, Core Languages, Frameworks, Tooling, Deployment, etc. appropriate for the role.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          roadmap_style: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section_name: { type: Type.STRING },
                learning_stage: { type: Type.STRING },
                nodes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      label: { type: Type.STRING },
                      order: { type: Type.NUMBER },
                      mandatory: { type: Type.BOOLEAN },
                      description: { type: Type.STRING }
                    },
                    required: ["id", "label", "order", "mandatory"]
                  }
                }
              },
              required: ["section_name", "learning_stage", "nodes"]
            }
          },
          dependencies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                from: { type: Type.STRING },
                to: { type: Type.STRING }
              },
              required: ["from", "to"]
            }
          },
          learning_notes: {
            type: Type.OBJECT,
            properties: {
              order_not_strict: { type: Type.BOOLEAN },
              beginner_friendly: { type: Type.BOOLEAN }
            },
            required: ["order_not_strict", "beginner_friendly"]
          }
        },
        required: ["role", "roadmap_style", "sections", "dependencies", "learning_notes"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

// ... keep other existing functions ...
export const getCareerAdvice = async (history: { role: string; content: string }[], profile: UserProfile) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are PathPilot AI, a personalized career advisor. Help the student with placement strategies.`,
    }
  });
  const lastMessage = history[history.length - 1].content;
  const result = await chat.sendMessage({ message: lastMessage });
  return result.text;
};

export const generatePrepPlan = async (targetRole: string, days: number, currentLevel: string): Promise<PrepPlan> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a placement preparation plan for a student targeting a ${targetRole} role in ${days} days.`,
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

export const analyzeResumeATS = async (resumeData: any, targetRole: string): Promise<ATSAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this resume for ${targetRole}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ats_score: { type: Type.NUMBER },
          ats_summary: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              quick_fixes: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["strengths", "weaknesses", "quick_fixes"]
          },
          bullet_improvements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                improved: { type: Type.STRING },
                keywords_added: { type: Type.ARRAY, items: { type: Type.STRING } },
                ats_reasoning: { type: Type.STRING }
              }
            }
          },
          skill_gap_analysis: {
            type: Type.OBJECT,
            properties: {
              high_priority: { type: Type.ARRAY, items: { type: Type.STRING } },
              medium_priority: { type: Type.ARRAY, items: { type: Type.STRING } },
              optional: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          recommended_template: {
            type: Type.OBJECT,
            properties: {
              template_name: { type: Type.STRING },
              best_for_roles: { type: Type.ARRAY, items: { type: Type.STRING } },
              why_it_works_for_ats: { type: Type.STRING }
            }
          },
          generated_resume: {
            type: Type.OBJECT,
            properties: {
              sections: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING },
                  experience: { type: Type.ARRAY, items: { type: Type.STRING } },
                  projects: { type: Type.ARRAY, items: { type: Type.STRING } },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  education: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
