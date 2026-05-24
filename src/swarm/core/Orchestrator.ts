import { GoogleGenAI, Type } from "@google/genai";

export interface ReasoningGateResult {
  isDevTask: boolean;
  reasoning: string;
  suggestedSkills: string[];
  confidence: number;
}

export interface RouteMatch {
  id: string;
  name: string;
  score: number;
  matchedTags: string[];
  matchedKeywords: string[];
}

export interface ContextBlueprint {
  activatedSkills: string[];
  payload: string;
  tokenEstimate: number;
  safetyStatus: string;
}

export class Orchestrator {
  /**
   * TIER 1: The Reasoning Gate
   * Intercepts the natural language prompt and reasons whether/how skills should be activated.
   */
  public static async runReasoningGate(
    prompt: string,
    skills: any[],
    apiKey?: string
  ): Promise<ReasoningGateResult> {
    const key = apiKey || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);
    
    if (!key || key === 'default_dev_key' || !key.startsWith('AIza')) {
      // Graceful local/edge fallback using heuristic rules
      return this.heuristicReasoningGate(prompt, skills);
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const skillListStr = skills.map(s => `${s.name} (${s.path.split('/').pop()?.replace('.md', '')}): ${s.description}`).join('\n');

      const systemInstruction = `You are the Reasoning Gate for SkillsGem AI. 
Analyze the user's prompt and decide if it is relevant to coding, databases, API design, deployment, testing, security, or other software development tasks.
Decide if any of the available skills match the user's request, and output your step-by-step reasoning along with a confidence rating (0 to 1).

Available Skills:
${skillListStr}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze this prompt: "${prompt}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isDevTask: {
                type: Type.BOOLEAN,
                description: "Whether the prompt represents a technical or developer-oriented task."
              },
              reasoning: {
                type: Type.STRING,
                description: "Step-by-step chain-of-thought analysis of why skills are or are not needed."
              },
              suggestedSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of matching skill slug IDs (e.g., ['surgical-debugger', 'gemini-api'])."
              },
              confidence: {
                type: Type.NUMBER,
                description: "The level of confidence in this routing decision (0.00 to 1.00)."
              }
            },
            required: ["isDevTask", "reasoning", "suggestedSkills", "confidence"]
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text.trim()) as ReasoningGateResult;
        return result;
      }
      throw new Error("No response generated from reasoning gate.");
    } catch (e: any) {
      console.warn("Reasoning Gate LLM failed or key rejected, falling back to heuristic engine:", e.message);
      return this.heuristicReasoningGate(prompt, skills);
    }
  }

  /**
   * TIER 1.5: Deterministic/Heuristic Reasoning Gate fallback
   */
  private static heuristicReasoningGate(prompt: string, skills: any[]): ReasoningGateResult {
    const text = prompt.toLowerCase();
    const suggestedSkills: string[] = [];
    let isDevTask = false;
    let confidence = 0.5;

    // Standard dev keywords
    const devKeywords = [
      'code', 'function', 'test', 'error', 'debug', 'database', 'sql', 'deploy', 'api', 'route',
      'github', 'pr', 'pull request', 'firebase', 'auth', 'oauth', 'cloudflare', 'worker', 'mcp',
      'hono', 'express', 'node', 'react', 'vite', 'npm', 'lint', 'security', 'crypto', 'jwt'
    ];

    if (devKeywords.some(keyword => text.includes(keyword))) {
      isDevTask = true;
      confidence = 0.8;
    }

    // Heuristically map prompt keywords to skill names and descriptions
    for (const skill of skills) {
      const slug = skill.path.split('/').pop()?.replace('.md', '') || skill.name.toLowerCase();
      const nameLower = skill.name.toLowerCase();
      const descLower = skill.description.toLowerCase();
      const tags = (skill.tags || []).map((t: string) => t.toLowerCase());

      // Let's token split our prompt to perform substring lookup
      const wordMatches = tags.some(tag => text.includes(tag)) || 
                          text.includes(nameLower) || 
                          (slug !== 'focus-mode' && text.includes(slug)) ||
                          (text.includes('auth') && slug.includes('auth')) ||
                          (text.includes('database') && slug.includes('database')) ||
                          (text.includes('firebase') && slug.includes('firebase')) ||
                          (text.includes('api') && slug.includes('api'));

      if (wordMatches) {
        suggestedSkills.push(slug);
      }
    }

    let reasoning = `[Heuristic Gate] Decided to route the request. Evaluated technical keywords. `;
    if (isDevTask) {
      reasoning += `Detected explicit developer-oriented tokens in request. Identified ${suggestedSkills.length} matching candidate skills.`;
    } else {
      reasoning += `Prompt seems general or low confidence, but scanned knowledge index for any applicable developer skills anyway.`;
    }

    return {
      isDevTask,
      reasoning,
      suggestedSkills: Array.from(new Set(suggestedSkills)),
      confidence
    };
  }

  /**
   * TIER 2: The Semantic Router
   * Dynamically aligns natural language queries to specific skill matches and ranks them.
   */
  public static runSemanticRouter(
    prompt: string,
    skills: any[],
    suggestedSlugs: string[]
  ): RouteMatch[] {
    const text = prompt.toLowerCase();
    const matches: RouteMatch[] = [];

    for (const skill of skills) {
      const slug = skill.path.split('/').pop()?.replace('.md', '') || skill.name.toLowerCase();
      const nameLower = skill.name.toLowerCase();
      const descLower = skill.description.toLowerCase();
      const tags = (skill.tags || []).map((t: string) => t.toLowerCase());

      let score = 0;
      const matchedTags: string[] = [];
      const matchedKeywords: string[] = [];

      // 1. Direct slug or name match (High Weight)
      if (text.includes(slug)) {
        score += 0.5;
        matchedKeywords.push(slug);
      }
      if (text.includes(nameLower)) {
        score += 0.4;
        matchedKeywords.push(nameLower);
      }

      // 2. Gate recommendation match (Medium-High Weight)
      if (suggestedSlugs.includes(slug)) {
        score += 0.35;
        matchedKeywords.push("reasoning-gate-recommendation");
      }

      // 3. Tag overlap (Medium Weight)
      for (const tag of tags) {
        if (text.includes(tag)) {
          score += 0.25;
          matchedTags.push(tag);
        }
      }

      // 4. Description content match (Low Weight)
      const descWords = descLower.replace(/[^\w\s]/g, '').split(/\s+/);
      const promptWords = text.replace(/[^\w\s]/g, '').split(/\s+/);
      let descMatches = 0;
      for (const arg of promptWords) {
        if (arg.length > 3 && descWords.includes(arg)) {
          descMatches++;
        }
      }
      if (descMatches > 0) {
        const wordWeight = Math.min(descMatches * 0.05, 0.2);
        score += wordWeight;
        matchedKeywords.push(`${descMatches}-description-tokens`);
      }

      // Normalize score to maximum of 1.00
      score = Math.min(Math.round(score * 100) / 100, 1.0);

      if (score > 0) {
        matches.push({
          id: slug,
          name: skill.name,
          score,
          matchedTags,
          matchedKeywords
        });
      }
    }

    // Sort by descending scores
    return matches.sort((a, b) => b.score - a.score);
  }

  /**
   * TIER 3: The Context Manager
   * Packages the activated skills into a highly optimized context payload.
   */
  public static buildContextPayload(
    matches: RouteMatch[],
    skillsContent: Record<string, string>,
    userCustomInstructions?: string,
    maxSkills: number = 3
  ): ContextBlueprint {
    const selectedMatches = matches.slice(0, maxSkills);
    const activatedSkills = selectedMatches.map(m => m.id);

    let payload = `=== SKILLSGEM AI DYNAMIC CONTEXT PAYLOAD ===
[SYSTEM NOTE] This custom context has been dynamically assembled using our Multi-Tiered Semantic Routing Protocol to align your specific prompt with official Skills guidelines. 
Follow these guidelines strictly. Do not deviate.

`;

    if (userCustomInstructions && userCustomInstructions.trim()) {
      payload += `--- USER CUSTOM OVERRIDE INSTRUCTIONS ---\n${userCustomInstructions.trim()}\n\n`;
    }

    for (const match of selectedMatches) {
      const content = skillsContent[match.id];
      if (content) {
        payload += `--- BEGIN SKILL: ${match.name} (${match.id}, Score: ${match.score}) ---\n`;
        payload += `${content.trim()}\n`;
        payload += `--- END SKILL: ${match.name} ---\n\n`;
      } else {
        payload += `--- SKILL INTEGRATION: ${match.name} (${match.id}, Score: ${match.score}) (Content pending lazy fetch) ---\n\n`;
      }
    }

    payload += `--- END OF DYNAMIC CONTEXT PAYLOAD ---`;

    // Simple char-based token estimator (1 token roughly equals 4 characters)
    const tokenEstimate = Math.ceil(payload.length / 4);
    const safetyStatus = tokenEstimate > 20000 ? "Warning: Context Bloat" : "Safe: Compact Range";

    return {
      activatedSkills,
      payload,
      tokenEstimate,
      safetyStatus
    };
  }
}
