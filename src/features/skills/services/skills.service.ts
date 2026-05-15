import { DynamicSkill } from '../types';

/**
 * Pure Service for interacting with the local LLM skills API endpoints.
 * All framework-agnostic data fetching logic belongs here.
 */
export const skillsService = {
  /**
   * Fetches the dynamic list of skills from the JSON manifest.
   */
  async fetchSkillsManifest(): Promise<DynamicSkill[]> {
    const response = await fetch('/llms.json');
    if (!response.ok) {
      throw new Error(`Failed to load dynamic skills: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Fetches the markdown content for a specific skill via the Hono API.
   * @param id The unique skill id to fetch
   */
  async fetchSkillMarkdown(id: string): Promise<string> {
    const response = await fetch(`/api/skills?id=${id}&mode=text`);
    if (!response.ok) {
      throw new Error(`Failed to fetch content for skill ID: ${id}`);
    }
    return response.text();
  }
};
