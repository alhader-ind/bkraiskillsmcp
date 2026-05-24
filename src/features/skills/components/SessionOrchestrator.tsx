import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Copy, AlertTriangle, Play, HelpCircle, Terminal, Layers, ShieldCheck } from 'lucide-react';

interface Match {
  id: string;
  name: string;
  score: number;
  matchedTags: string[];
  matchedKeywords: string[];
}

interface OrchestrationData {
  success: boolean;
  prompt: string;
  reasoningGate: {
    isDevTask: boolean;
    reasoning: string;
    suggestedSkills: string[];
    confidence: number;
  };
  semanticRouter: {
    allMatches: Match[];
    topMatches: { id: string; name: string; score: number }[];
  };
  contextBlueprint: {
    activatedSkills: string[];
    payload: string;
    tokenEstimate: number;
    safetyStatus: string;
  };
}

export const SessionOrchestrator: React.FC = () => {
  const [prompt, setPrompt] = useState('How do I build a secure API route with JWT auth and test it for edge performance?');
  const [customInstructions, setCustomInstructions] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrchestrationData | null>(null);

  // Simulation states
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOrchestrate = async () => {
    setLoading(true);
    setError(null);
    setSimulationResult(null);
    try {
      const response = await fetch('/api/skills/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          apiKey: apiKey.trim() || undefined,
          customInstructions
        })
      });

      if (!response.ok) {
        throw new Error(`Orchestration failed: ${response.statusText}`);
      }

      const resJson = await response.json();
      setData(resJson);
    } catch (err: any) {
      setError(err.message || 'Unknown network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    if (!data) return;
    setSimulating(true);
    setSimulationResult(null);
    try {
      const response = await fetch('/api/skills/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstructions: data.contextBlueprint.payload,
          apiKey: apiKey.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Simulation failed: ${response.statusText}`);
      }

      const resJson = await response.json();
      if (resJson.simulationText) {
        setSimulationResult(resJson.simulationText);
      } else {
        throw new Error(resJson.error || 'No simulation output generated.');
      }
    } catch (err: any) {
      setSimulationResult(`Simulation Error: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.contextBlueprint.payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getConfidenceColor = (val: number) => {
    if (val >= 0.8) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (val >= 0.5) return 'text-amber-700 bg-amber-50 border-amber-100';
    return 'text-red-700 bg-red-50 border-red-100';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Introduction */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
        <Layers className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Adaptive Prompt Orchestrator</h4>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            This module showcases the project's <strong>Multi-Tiered Routing & Instruction Synthesis</strong>. Enter a user query, run the orchestrator, and witness the <strong>Reasoning Gate (Tier 1)</strong>, <strong>Semantic Router (Tier 2)</strong>, and <strong>Context Manager (Tier 3)</strong> collaborate seamlessly.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4">
        <div>
          <label htmlFor="user-prompt" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            1. Describe Your Technical Task or Query
          </label>
          <textarea
            id="user-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type any software engineering request..."
            className="w-full text-sm font-sans p-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="custom-instructions" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              Custom Directives <span className="text-[10px] font-normal text-slate-400 capitalize">(optional override)</span>
            </label>
            <input
              id="custom-instructions"
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Always output plain Javascript, no Typescript"
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="custom-api-key" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              Gemini API Key <span className="text-[10px] font-normal text-slate-400 capitalize">(Optional – falls back to Settings)</span>
            </label>
            <input
              id="custom-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AI Studio key beginning with AIza..."
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        <button
          onClick={handleOrchestrate}
          disabled={loading || !prompt.trim()}
          id="orchestrate-btn"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition focus:ring-2 focus:ring-blue-400 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Prompt Context Tiers...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blue-100" />
              <span>Run Auto-Segmentation (3 Tiers)</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs">
          <strong>Orchestration Core Failed:</strong> {error}
        </div>
      )}

      {/* Active Output Visualization */}
      {data && (
        <div className="space-y-6 mt-4 animate-in fade-in duration-300">
          <h3 className="text-sm font-semibold text-slate-800 tracking-wide flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-slate-500" /> System Orchestrated Trace Pipelines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TIER 1: Reasoning Gate */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Tier 1: Reasoning Gate
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getConfidenceColor(data.reasoningGate.confidence)}`}>
                  Confidence: {Math.round(data.reasoningGate.confidence * 100)}%
                </span>
              </div>
              
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-md font-medium shrink-0 ${data.reasoningGate.isDevTask ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600'}`}>
                  {data.reasoningGate.isDevTask ? "Dev Context Detected" : "General Context"}
                </span>
                <div className="flex flex-wrap gap-1">
                  {data.reasoningGate.suggestedSkills.map((sk, idx) => (
                    <span key={`sug-${sk}-${idx}`} className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      {sk}
                    </span>
                  ))}
                  {data.reasoningGate.suggestedSkills.length === 0 && (
                    <span className="text-[10px] text-slate-400 italic">No direct slugs flagged</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <h5 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Reasoning Trace Logs</h5>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "{data.reasoningGate.reasoning}"
                </p>
              </div>
            </div>

            {/* TIER 2: Semantic Router */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> Tier 2: Semantic Router
                </span>
                <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                  Sorted Matches: {data.semanticRouter.allMatches.length}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[175px] overflow-y-auto pr-1">
                {data.semanticRouter.allMatches.map((match) => (
                  <div key={match.id} className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 font-mono text-[11px]">{match.id}</span>
                      <span className="font-semibold text-blue-600 font-mono text-[10px]">{Math.round(match.score * 100)}% Match</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${match.score * 100}%` }} />
                    </div>
                    {/* Tags */}
                    {(match.matchedTags.length > 0 || match.matchedKeywords.length > 0) && (
                      <div className="flex flex-wrap gap-1 mt-1 text-[9px]">
                        {match.matchedTags.map((tag, idx) => (
                          <span key={`tag-${match.id}-${tag}-${idx}`} className="bg-indigo-50 border border-indigo-100 text-indigo-500 px-1 rounded">
                            #{tag}
                          </span>
                        ))}
                        {match.matchedKeywords.filter(k => k !== 'reasoning-gate-recommendation' && !k.includes('description-tokens')).map((kw, idx) => (
                          <span key={`kw-${match.id}-${kw}-${idx}`} className="bg-emerald-50 border border-emerald-100 text-emerald-500 px-1 rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {data.semanticRouter.allMatches.length === 0 && (
                  <div className="text-center text-slate-400 py-6 text-xs italic">
                    No relevant skills matched user prompt tokens.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TIER 3: Context Manager Assembled Payload */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" /> Tier 3: Context Manager Output
                </span>
                <p className="text-[10px] text-slate-400">Synthesized instruction payload for remote API request proxying</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">
                  {data.contextBlueprint.tokenEstimate.toLocaleString()} est. tokens
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {data.contextBlueprint.safetyStatus}
                </span>
              </div>
            </div>

            <div className="relative">
              <pre className="text-xs p-3 bg-slate-900 text-slate-200 rounded-xl overflow-x-auto max-h-[160px] font-mono leading-relaxed">
                {data.contextBlueprint.payload}
              </pre>
              <div className="absolute top-2 right-2 flex gap-1.5">
                <button
                  onClick={handleCopy}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg hover:text-white transition cursor-pointer"
                  title="Copy Prompt payload"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sandbox Execution Zone */}
            <div className="bg-slate-50 border border-slate-200/65 rounded-xl p-4 mt-2 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Live Prompt Execution Sandbox</h4>
                </div>
                <span className="text-[9px] text-slate-400">Run using synthesised system-rules above</span>
              </div>

              <button
                onClick={handleSimulate}
                disabled={simulating}
                id="simulate-btn"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 font-medium rounded-lg text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {simulating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Engaging Gemini Core Models...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 border-emerald-100" />
                    <span>Evaluate Prompt Sandbox Execution Run</span>
                  </>
                )}
              </button>

              {simulationResult && (
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 shadow-sm leading-relaxed whitespace-pre-wrap animate-in fade-in duration-300 font-sans">
                  {simulationResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
