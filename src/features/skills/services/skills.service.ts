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
   * Fetches the markdown content for a specific skill.
   * @param path The URL path to fetch the markdown from
   */
  async fetchSkillMarkdown(path: string): Promise<string> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch content from ${path}`);
    }
    return response.text();
  }
};
