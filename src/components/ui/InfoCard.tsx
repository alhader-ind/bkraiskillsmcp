import React from 'react';

interface InfoCardProps {
  icon: React.ElementType;
  iconColorClass: string;
  title: string;
  subtitle: string;
  details: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, iconColorClass, title, subtitle, details }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
      <Icon className={`w-8 h-8 ${iconColorClass} mb-3`} />
      <h4 className="font-semibold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-600 mt-1">{subtitle}<br/>{details}</p>
    </div>
  );
};
