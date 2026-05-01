import React, { useState } from 'react';
import { SkillItem } from './SkillItem';
import { SKILLS_LIST } from '../constants/skills';
import { skillsData } from '../skillsData';
import { stripFrontmatter } from '../lib/utils';
import { Copy, PackageCheck } from 'lucide-react';

/**
 * Main component to display the Skills Knowledge Base.
 * Manages the expanded state of individual skill items and the Context Cart.
 * 
 * @returns {React.JSX.Element} The rendered SkillsReport component.
 */
export const SkillsReport = () => {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  /**
   * Toggles the expansion state of a skill item based on its ID.
   * 
   * @param {string} skillId - The unique identifier of the skill to toggle.
   */
  const handleToggle = (skillId: string) => {
    setExpandedSkill(prev => prev === skillId ? null : skillId);
  };

  /**
   * Toggles whether a skill is in the custom context payload cart.
   */
  const handleToggleCart = (skillId: string) => {
    setCart(prev => prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]);
  };

  /**
   * Generates custom context payload from selected skills.
   */
  const copyCustomContext = () => {
    if (cart.length === 0) return;
    
    let payload = `<system_instructions>\n  <context>\n    You are generating code for a project. Please adhere strictly to the following integrated core skills:\n  </context>\n\n`;
    
    cart.forEach(skillId => {
      payload += `  <skill name="${skillId}">\n`;
      payload += skillsData[skillId] ? stripFrontmatter(skillsData[skillId]).replace(/^/gm, '    ') : '';
      payload += `\n  </skill>\n\n`;
    });
    
    payload += `</system_instructions>`;
    
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500 relative">
      {cart.length > 0 && (
        <div className="sticky top-4 z-40 bg-slate-900 text-slate-50 rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Dynamic Context Cart</h3>
              <p className="text-slate-400 text-xs mt-0.5">{cart.length} skill(s) selected for context packaging.</p>
            </div>
          </div>
          <button 
            onClick={copyCustomContext}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto justify-center"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Payload Copied!' : 'Copy Context Payload'}
          </button>
        </div>
      )}

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-2">
        <p className="text-xs text-slate-500 leading-relaxed">
          This knowledge base is served as an <span className="font-semibold text-blue-600">MCP (Model Context Protocol)</span> resource. 
          AI agents can access the raw instructions via the machine-readable <a href="/llms.txt" className="text-blue-600 font-medium hover:underline">/llms.txt</a>. To create an optimized custom prompt, select specific skills to pack into a focused context payload.
        </p>
      </div>
      
      {SKILLS_LIST.map((skill) => {
        const isExpanded = expandedSkill === skill.id;
        const inCart = cart.includes(skill.id);
        const markdownContent = skillsData[skill.id] ? stripFrontmatter(skillsData[skill.id]) : 'No data available.';

        return (
          <SkillItem 
            key={skill.id}
            skill={skill}
            isExpanded={isExpanded}
            inCart={inCart}
            onToggle={() => handleToggle(skill.id)}
            onToggleCart={() => handleToggleCart(skill.id)}
            markdownContent={markdownContent}
          />
        );
      })}
    </div>
  );
};
