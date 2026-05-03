import React from 'react';

export const Footer: React.FC = () => (
  <footer className="mt-12 mb-8 text-center border-t border-slate-200 pt-8 opacity-60 hover:opacity-100 transition-opacity">
    <p className="text-xs text-slate-500 mb-3">Model Context Protocol (MCP) & Discovery</p>
    <div className="flex justify-center gap-6 text-xs text-blue-600 font-medium">
      <a href="/llms.txt" className="hover:underline">/llms.txt</a>
      <a href="/.well-known/llms.txt" className="hover:underline">/.well-known/llms.txt</a>
      <a href="/llms.json" className="hover:underline">/llms.json</a>
      <a href="https://github.com/alhader-ind/bkraiskillsmcp" target="_blank" rel="noopener noreferrer" className="hover:underline">Source</a>
    </div>
  </footer>
);
