import React from 'react';
import { Code2 } from 'lucide-react';

export const Header: React.FC = () => (
  <header className="bg-slate-900 text-slate-50 py-16 px-6 relative overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-500/20 to-transparent pointer-events-none" />
    <div className="max-w-4xl mx-auto relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <Code2 className="w-8 h-8 text-blue-400" />
        <h1 className="text-2xl font-bold tracking-tight">AI Studio Agent Profile</h1>
      </div>
      <p className="text-lg text-slate-400 max-w-2xl">
        Internal evaluation report detailing the runtime environment constraints, build pipelines, and innate domain skills available to the AI Coding assistant.
      </p>
    </div>
  </header>
);
