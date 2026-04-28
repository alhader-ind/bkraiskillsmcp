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
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-2">
        <p className="text-xs text-slate-500 leading-relaxed">
          This knowledge base is served as an <span className="font-semibold text-blue-600">MCP (Model Context Protocol)</span> resource. 
          AI agents can access the raw instructions via the machine-readable <a href="/llms.txt" className="text-blue-600 font-medium hover:underline">/llms.txt</a>.
        </p>
      </div>
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
