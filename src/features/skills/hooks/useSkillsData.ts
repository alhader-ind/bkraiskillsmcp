import { useState, useEffect, useCallback } from 'react';
import { skillsService } from '../services/skills.service';
import { DynamicSkill } from '../types';

export const useSkillsData = () => {
  const [dynamicSkills, setDynamicSkills] = useState<DynamicSkill[]>([]);
  const [skillsContent, setSkillsContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const initFetch = async () => {
      try {
        setLoading(true);
        const data = await skillsService.fetchSkillsManifest();
        if (isMounted) setDynamicSkills(data);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    initFetch();
    return () => { isMounted = false; };
  }, []);

  const loadSkillContent = useCallback(async (id: string, path: string) => {
    if (skillsContent[id]) return; // Already cached
    try {
      const content = await skillsService.fetchSkillMarkdown(path);
      setSkillsContent(prev => ({ ...prev, [id]: content }));
    } catch (err) {
      console.error(`Failed to fetch content for ${id}`);
    }
  }, [skillsContent]);

  return {
    dynamicSkills,
    skillsContent,
    loading,
    error,
    loadSkillContent
  };
};
