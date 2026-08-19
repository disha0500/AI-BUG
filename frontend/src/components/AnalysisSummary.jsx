import React from 'react';

const SEVERITY_BADGES = {
  Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  High: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
};

export default function AnalysisSummary({ analysisResult, onSelectBug }) {
  if (!analysisResult) return null;

  const { bugs = [], stats = {} } = analysisResult;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Analysis Summary</h3>
          <p className="text-xs text-slate-400">Detected {bugs.length} issues across the provided file.</p>
        </div>
        
        <div className="flex space-x-2">
          {['Critical', 'High', 'Medium', 'Low'].map((sev) => (
            <span
              key={sev}
              className={`text-xs px-2.5 py-1 rounded-md border font-medium ${SEVERITY_BADGES[sev] || 'text-slate-400 border-slate-700'}`}
            >
              {sev}: {stats[sev.toLowerCase()] || bugs.filter((b) => b.severity?.toLowerCase() === sev.toLowerCase()).length}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {bugs.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No bugs or vulnerabilities detected. Clean code!</p>
        ) : (
          bugs.map((bug, index) => (
            <div
              key={bug.id || index}
              onClick={() => onSelectBug && onSelectBug(bug)}
              className="group p-3.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/40 rounded-lg cursor-pointer transition flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${SEVERITY_BADGES[bug.severity]}`}>
                    {bug.severity}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{bug.type}</span>
                  <span className="text-xs text-slate-400 font-mono">Line {bug.line || 'N/A'}</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">{bug.description}</p>
              </div>

              <div className="flex flex-col items-end shrink-0 space-y-1">
                <span className="text-[11px] text-indigo-400 font-medium group-hover:underline">View Fix &rarr;</span>
                <span className="text-[10px] text-slate-500 font-mono">Confidence: {bug.confidence || 85}%</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}