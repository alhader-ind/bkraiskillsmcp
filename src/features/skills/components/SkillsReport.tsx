import React, { useState } from 'react';
import { CartBanner } from './CartBanner';
import { SkillList } from './SkillList';
import { useSkillsData } from '../hooks/useSkillsData';

/**
 * Domain-driven container component for the Skills section.
 * Eliminates "God Component" anti-pattern by coordinating purely between Hooks and Presentation layers.
 */
export const SkillsReport: React.FC = () => {
  const { dynamicSkills, skillsContent, loading, error, loadSkillContent } = useSkillsData();
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const handleToggle = (skillId: string) => {
    if (expandedSkill !== skillId) {
      loadSkillContent(skillId);
    }
    setExpandedSkill(prev => prev === skillId ? null : skillId);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
        System Error: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500 relative">
      <CartBanner dynamicSkills={dynamicSkills} skillsContent={skillsContent} />

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-2">
        <p className="text-xs text-slate-500 leading-relaxed">
          This knowledge base is served as an <span className="font-semibold text-blue-600">MCP (Model Context Protocol)</span> resource. 
          AI agents can access the raw instructions via the machine-readable <a href="/llms.txt" className="text-blue-600 font-medium hover:underline">/llms.txt</a>. To create an optimized custom prompt, select specific skills to pack into a focused context payload.
        </p>
      </div>
      
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Re-indexing Knowledge Base...</p>
        </div>
      ) : (
        <SkillList 
          dynamicSkills={dynamicSkills} 
          skillsContent={skillsContent} 
          expandedSkill={expandedSkill} 
          onToggleSkill={handleToggle} 
        />
      )}
    </div>
  );
};
