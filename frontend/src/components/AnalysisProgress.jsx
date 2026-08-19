import React from 'react';

const STAGES = [
  { id: 1, label: 'AST & Syntax Parsing' },
  { id: 2, label: 'Static Analysis (Bandit / Flake8)' },
  { id: 3, label: 'AI Reasoning & Context Analysis' },
  { id: 4, label: 'Severity & Confidence Scoring' },
  { id: 5, label: 'Generating Explanation & Fixes' },
];

export default function AnalysisProgress({ currentStage = 1 }) {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
        </span>
        Pipeline Analysis in Progress
      </h3>

      <div className="space-y-3">
        {STAGES.map((stage) => {
          const isDone = stage.id < currentStage;
          const isCurrent = stage.id === currentStage;

          return (
            <div key={stage.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                {isDone ? (
                  <span className="h-5 w-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </span>
                ) : isCurrent ? (
                  <span className="h-5 w-5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-500/40 flex items-center justify-center animate-pulse font-bold text-[10px]">
                    ●
                  </span>
                ) : (
                  <span className="h-5 w-5 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center text-[10px]">
                    {stage.id}
                  </span>
                )}
                <span className={`${isCurrent ? 'text-indigo-300 font-semibold' : isDone ? 'text-slate-300' : 'text-slate-500'}`}>
                  {stage.label}
                </span>
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                {isDone ? 'Completed' : isCurrent ? 'Running...' : 'Queued'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}