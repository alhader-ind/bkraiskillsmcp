import React, { useState } from 'react';
import { Copy, PackageCheck } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { DynamicSkill } from '../types';
import { stripFrontmatter } from '../../../lib/utils';

interface CartBannerProps {
  dynamicSkills: DynamicSkill[];
  skillsContent: Record<string, string>;
}

/**
 * Presentation component for the context cart.
 * Consumes global store for cart state independently, reducing prop drilling.
 */
export const CartBanner: React.FC<CartBannerProps> = ({ dynamicSkills, skillsContent }) => {
  const { cart } = useCartStore();
  const [copied, setCopied] = useState(false);

  if (cart.length === 0) return null;

  const copyCustomContext = () => {
    let payload = `<system_instructions>\n  <context>\n    You are generating code for a project. Please adhere strictly to the following integrated core skills:\n  </context>\n\n`;
    
    cart.forEach(skillId => {
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
    <div className="sticky top-4 z-40 bg-slate-900 text-slate-50 rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-700 mb-4">
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
  );
};
