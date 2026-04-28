import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Skill } from '../types';

/**
 * Properties for the SkillItem component.
 */
interface SkillItemProps {
  skill: Skill;
  isExpanded: boolean;
  onToggle: () => void;
  markdownContent: string;
}

/**
 * Renders a single skill card, displaying its overview and conditionally 
 * rendering an expanded verbatim SKILL.md content.
 * 
 * @param {SkillItemProps} props - The component properties.
 * @returns {React.JSX.Element} The rendered skill item component.
 */
export const SkillItem = ({ skill, isExpanded, onToggle, markdownContent }: SkillItemProps) => {
  return (
    <div className="flex flex-col p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`p-3 rounded-lg shrink-0 h-fit ${skill.color}`}>
          {skill.icon}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-900">{skill.name}</h4>
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
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 prose prose-sm prose-slate max-w-none prose-pre:bg-slate-800 prose-pre:text-slate-100 overflow-x-auto">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
