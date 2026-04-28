import React, { useState } from 'react';
import { SkillItem } from './SkillItem';
import { SKILLS_LIST } from '../constants/skills';
import { skillsData } from '../skillsData';
import { stripFrontmatter } from '../lib/utils';

/**
 * Main component to display the Skills Knowledge Base.
 * Manages the expanded state of individual skill items.
 * 
 * @returns {React.JSX.Element} The rendered SkillsReport component.
 */
export const SkillsReport = () => {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  /**
   * Toggles the expansion state of a skill item based on its ID.
   * 
   * @param {string} skillId - The unique identifier of the skill to toggle.
   */
  const handleToggle = (skillId: string) => {
    setExpandedSkill(prev => prev === skillId ? null : skillId);
  };

  return (
    <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500">
      {SKILLS_LIST.map((skill) => {
        const isExpanded = expandedSkill === skill.id;
        const markdownContent = skillsData[skill.id] ? stripFrontmatter(skillsData[skill.id]) : 'No data available.';

        return (
          <SkillItem 
            key={skill.id}
            skill={skill}
            isExpanded={isExpanded}
            onToggle={() => handleToggle(skill.id)}
            markdownContent={markdownContent}
          />
        );
      })}
    </div>
  );
};
