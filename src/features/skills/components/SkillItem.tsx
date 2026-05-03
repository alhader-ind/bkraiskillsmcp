import React from 'react';
import { FileText, ChevronDown, ChevronUp, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Skill } from '../types';
import { MarkdownViewer } from '../../../components/ui/MarkdownViewer';

/**
 * Properties for the SkillItem component.
 */
interface SkillItemProps {
  skill: Skill;
  isExpanded: boolean;
  inCart: boolean;
  onToggle: () => void;
  onToggleCart: () => void;
  markdownContent: string;
}

/**
 * Renders a single skill card, displaying its overview and conditionally 
 * rendering an expanded verbatim SKILL.md content.
 * 
 * @param {SkillItemProps} props - The component properties.
 * @returns {React.JSX.Element} The rendered skill item component.
 */
export const SkillItem = ({ skill, isExpanded, inCart, onToggle, onToggleCart, markdownContent }: SkillItemProps) => {
  return (
    <div className={`flex flex-col p-5 bg-white border rounded-xl hover:shadow-md transition-all duration-200 ${inCart ? 'border-blue-400 ring-1 ring-blue-400 bg-blue-50/20' : 'border-slate-200'}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`p-3 rounded-lg shrink-0 h-fit ${skill.color}`}>
          {skill.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className="text-lg font-semibold text-slate-900">{skill.name}</h4>
            <button
              onClick={onToggleCart}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                inCart 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {inCart ? <CheckCircle2 className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
              {inCart ? 'Selected' : 'Add to Context'}
            </button>
          </div>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">{skill.description}</p>
          <ul className="mt-3 space-y-1.5">
            {skill.examples.map((example, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-slate-400 mt-0.5">•</span>
                <span>{example}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={onToggle}
            className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FileText className="w-4 h-4" />
            {isExpanded ? 'Hide verbatim file' : 'Read verbatim SKILL.md'}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 overflow-x-hidden">
            <MarkdownViewer content={markdownContent} />
          </div>
        </div>
      )}
    </div>
  );
};
