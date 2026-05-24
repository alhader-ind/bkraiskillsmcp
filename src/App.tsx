import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Tabs } from './components/ui/Tabs';
import { EnvironmentReport } from './features/environment/components/EnvironmentReport';
import { SkillsReport } from './features/skills/components/SkillsReport';
import { SessionOrchestrator } from './features/skills/components/SessionOrchestrator';

/**
 * Main application entry point demonstrating the agent profile content and sections.
 * 
 * @returns {React.JSX.Element} The rendered root component.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('env');

  const tabs = [
    { id: 'env', label: 'Native Environment Build' },
    { id: 'skills', label: 'Skill Knowledge Base' },
    { id: 'orchestrator', label: 'Adaptive Orchestrator Pro' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {activeTab === 'env' ? (
            <EnvironmentReport />
          ) : activeTab === 'skills' ? (
            <SkillsReport />
          ) : (
            <SessionOrchestrator />
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}
