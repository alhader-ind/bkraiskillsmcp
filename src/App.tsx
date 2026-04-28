import React, { useState } from 'react';
import { Code2 } from 'lucide-react';
import { EnvironmentReport } from './components/EnvironmentReport';
import { SkillsReport } from './components/SkillsReport';

/**
 * Main application entry point demonstrating the agent profile content and sections.
 * 
 * @returns {React.JSX.Element} The rendered root component.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState<'env' | 'skills'>('env');

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2 mb-8">
          <div className="flex gap-2 relative z-0">
            <button 
              onClick={() => setActiveTab('env')}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-colors duration-200 ${
                activeTab === 'env' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Native Environment Build
            </button>
            <button 
              onClick={() => setActiveTab('skills')}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-colors duration-200 ${
                activeTab === 'skills' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Skill Knowledge Base
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {activeTab === 'env' ? <EnvironmentReport /> : <SkillsReport />}
        </div>
      </main>
    </div>
  );
}
