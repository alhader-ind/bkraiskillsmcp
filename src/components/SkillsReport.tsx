import React, { useState, useEffect } from 'react';
import { SkillItem } from './SkillItem';
import { SKILLS_LIST } from '../constants/skills';
import { stripFrontmatter } from '../lib/utils';
import { Copy, PackageCheck, Zap, Laptop, BookOpen } from 'lucide-react';

interface DynamicSkill {
  name: string;
  description: string;
  path: string;
  tags: string[];
  estimatedTokens: number;
}

/**
 * Main component to display the Skills Knowledge Base.
 * Manages the expanded state of individual skill items and the Context Cart.
 */
export const SkillsReport = () => {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [dynamicSkills, setDynamicSkills] = useState<DynamicSkill[]>([]);
  const [skillsContent, setSkillsContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Use the pre-bundled skillsData for core skills to avoid initial waterfall
  // but we'll fetch others on demand or from the json
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/llms.json');
        if (response.ok) {
          const data = await response.json();
          setDynamicSkills(data);
        }
      } catch (err) {
        console.error('Failed to load dynamic skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const fetchSkillContent = async (id: string, path: string) => {
    if (skillsContent[id]) return;
    try {
      const response = await fetch(path);
      if (response.ok) {
        const text = await response.text();
        setSkillsContent(prev => ({ ...prev, [id]: text }));
      }
    } catch (err) {
      console.error(`Failed to fetch content for ${id}:`, err);
    }
  };

  /**
   * Toggles the expansion state of a skill item based on its ID.
   */
  const handleToggle = (skillId: string, path: string) => {
    if (expandedSkill !== skillId) {
      fetchSkillContent(skillId, path);
    }
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
      const skill = dynamicSkills.find(s => s.name === skillId || s.path.includes(skillId));
      const content = skillsContent[skillId] || '';
      
      payload += `  <skill name="${skillId}">\n`;
      payload += content ? stripFrontmatter(content).replace(/^/gm, '    ') : '';
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
      
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Re-indexing Knowledge Base...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dynamicSkills.map((skill) => {
            // Find if it's a native skill to match icons/colors
            const id = skill.path.split('/').pop()?.replace('.md', '') || skill.name;
            const nativeSkill = SKILLS_LIST.find(s => s.id === id);
            
            const isExpanded = expandedSkill === id;
            const inCart = cart.includes(id);
            const markdownContent = skillsContent[id] ? stripFrontmatter(skillsContent[id]) : 'Click to load instructions...';

            // Map some icons based on tags if no native match
            const getIcon = () => {
              if (nativeSkill) return nativeSkill.icon;
              if (skill.tags.some(t => t.toLowerCase().includes('cloud'))) return <Zap className="w-5 h-5" />;
              if (skill.tags.some(t => t.toLowerCase().includes('frontend'))) return <Laptop className="w-5 h-5" />;
              return <BookOpen className="w-5 h-5" />;
            };

            const getColor = () => {
              if (nativeSkill) return nativeSkill.color;
              if (skill.path.includes('cloudflare-')) return 'bg-orange-50 text-orange-600';
              if (skill.path.includes('vercel-')) return 'bg-blue-50 text-blue-600';
              return 'bg-slate-50 text-slate-600';
            };

            const displaySkill = {
              name: skill.name,
              id: id,
              description: skill.description,
              icon: getIcon(),
              color: getColor(),
              examples: [`Tags: ${skill.tags.join(', ')}`, `Est. Context Size: ~${skill.estimatedTokens} tokens`]
            };

            return (
              <SkillItem 
                key={skill.path}
                skill={displaySkill}
                isExpanded={isExpanded}
                inCart={inCart}
                onToggle={() => handleToggle(id, skill.path)}
                onToggleCart={() => handleToggleCart(id)}
                markdownContent={markdownContent}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
