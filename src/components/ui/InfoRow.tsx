import React from 'react';

interface InfoRowProps {
  tagColorClass: string;
  tagText: string;
  description: React.ReactNode;
}

export const InfoRow: React.FC<InfoRowProps> = ({ tagColorClass, tagText, description }) => {
  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      <div className="md:w-1/3">
        <span className={`inline-block px-2 py-1 ${tagColorClass} rounded text-xs font-semibold uppercase tracking-wider mb-2`}>
          {tagText}
        </span>
      </div>
      <div className="md:w-2/3">
        <p className="text-sm text-slate-700">{description}</p>
      </div>
    </div>
  );
};
