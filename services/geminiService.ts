
import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapData, PrepPlan, UserProfile, ATSAnalysis, ChatMessage } from "../types";

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

export const analyzeResumeATS = async (
  resumeData: any, 
  targetRole: string,
  jobDescription: string = "NONE",
  experienceLevel: string = "Junior",
  industry: string = "Tech",
  fileData?: { data: string; mimeType: string }
): Promise<ATSAnalysis> => {
  
  const systemPrompt = `
    You are an expert ATS (Applicant Tracking System) analyst, professional resume writer, and technical recruiter.

    Your task is to:
    1. Analyze the provided resume (either text or file) strictly from an ATS + recruiter screening perspective.
    2. Score the resume based on real ATS parsing rules.
    3. Optimize the resume for higher interview selection probability.
    4. Rewrite content using strong action verbs, quantified impact, and role-aligned keywords.
    
    TARGET_ROLE: ${targetRole}
    JOB_DESCRIPTION: ${jobDescription}
    EXPERIENCE_LEVEL: ${experienceLevel}
    INDUSTRY: ${industry}
    
    Analyze and output JSON based on the schema provided.
  `;

  let requestContents;

  if (fileData) {
    // Multimodal Request (File + Text)
    requestContents = {
      parts: [
        {
          inlineData: {
            mimeType: fileData.mimeType,
            data: fileData.data
          }
        },
        {
          text: systemPrompt
        }
      ]
    };
  } else {
    // Text-only Request
    requestContents = {
      parts: [
        {
          text: `${systemPrompt}\n\nRESUME_TEXT:\n${JSON.stringify(resumeData)}`
        }
      ]
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Supports multimodal input
    contents: requestContents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ats_score: {
            type: Type.OBJECT,
            properties: {
              total: { type: Type.NUMBER },
              breakdown: {
                type: Type.OBJECT,
                properties: {
                  keyword_relevance: { type: Type.NUMBER },
                  formatting: { type: Type.NUMBER },
                  content_strength: { type: Type.NUMBER },
                  role_alignment: { type: Type.NUMBER },
                  completeness: { type: Type.NUMBER }
                },
                required: ["keyword_relevance", "formatting", "content_strength", "role_alignment", "completeness"]
              },
              summary: { type: Type.STRING }
            },
            required: ["total", "breakdown", "summary"]
          },
          keyword_analysis: {
            type: Type.OBJECT,
            properties: {
              missing_critical: { type: Type.ARRAY, items: { type: Type.STRING } },
              underused: { type: Type.ARRAY, items: { type: Type.STRING } },
              irrelevant: { type: Type.ARRAY, items: { type: Type.STRING } },
              classification: {
                type: Type.OBJECT,
                properties: {
                  technical: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                  soft_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  role_specific: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            required: ["missing_critical"]
          },
          bullet_improvements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                improved: { type: Type.STRING },
                improvement_type: { type: Type.STRING }
              }
            }
          },
          formatting_feedback: {
            type: Type.OBJECT,
            properties: {
              issues: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          role_specific_improvements: {
            type: Type.OBJECT,
            properties: {
              skills_to_add: { type: Type.ARRAY, items: { type: Type.STRING } },
              sections_to_enhance: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          verdict: {
            type: Type.OBJECT,
            properties: {
              estimated_post_fix_score: { type: Type.NUMBER },
              status: { type: Type.STRING, enum: ["Not Ready", "Partially Ready", "Interview Ready"] },
              checklist: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["status", "checklist", "estimated_post_fix_score"]
          }
        },
        required: ["ats_score", "keyword_analysis", "bullet_improvements", "verdict"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const chatWithResume = async (
    chatHistory: ChatMessage[], 
    resumeContext: any, 
    currentMessage: string
): Promise<string> => {
  
  const contextString = typeof resumeContext === 'string' 
    ? resumeContext 
    : JSON.stringify(resumeContext);

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a Resume Copilot. The user has uploaded their resume and received an ATS analysis.
      
      RESUME CONTEXT:
      ${contextString.substring(0, 5000)}

      Your goal is to answer specific questions to help them improve it.
      - If they ask "rewrite this", provide a concrete, better version.
      - If they ask about formatting, give specific advice.
      - Keep answers concise and actionable.
      `,
    }
  });

  // Replay history to build context
  // Note: For a real app, you'd manage history better to avoid token limits.
  // Here we just send the last message for MVP simplicity or reconstruct if needed.
  
  const result = await chat.sendMessage({ message: currentMessage });
  return result.text || "I couldn't process that request.";
};
