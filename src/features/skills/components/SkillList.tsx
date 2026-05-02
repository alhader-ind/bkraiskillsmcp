import React from 'react';
import { Zap, Laptop, BookOpen } from 'lucide-react';
import { SKILLS_LIST } from '../../../constants/skills';
import { SkillItem } from '../../../components/SkillItem';
import { stripFrontmatter } from '../../../lib/utils';
import { useCartStore } from '../store/useCartStore';
import { DynamicSkill } from '../types';

interface SkillListProps {
  dynamicSkills: DynamicSkill[];
  skillsContent: Record<string, string>;
  expandedSkill: string | null;
  onToggleSkill: (id: string, path: string) => void;
}

/**
 * Presentation component mapping the raw array of dynamic skills to the UI components.
 * Adheres to Concerns Partitioning by removing local state from mapping logic.
 */
export const SkillList: React.FC<SkillListProps> = ({ 
  dynamicSkills, 
  skillsContent, 
  expandedSkill, 
  onToggleSkill 
}) => {
  const { cart, toggleCart } = useCartStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {dynamicSkills.map((skill) => {
        // Architecture Domain Mapping: Connecting dynamic manifest identity with static UI constants
        const id = skill.path.split('/').pop()?.replace('.md', '') || skill.name;
        const nativeSkill = SKILLS_LIST.find(s => s.id === id);
        
        const isExpanded = expandedSkill === id;
        const inCart = cart.includes(id);
        const markdownContent = skillsContent[id] 
          ? stripFrontmatter(skillsContent[id]) 
          : 'Click to load instructions...';

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
            onToggle={() => onToggleSkill(id, skill.path)}
            onToggleCart={() => toggleCart(id)}
            markdownContent={markdownContent}
          />
        );
      })}
    </div>
  );
};
