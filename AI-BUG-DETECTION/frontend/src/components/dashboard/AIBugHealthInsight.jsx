// Ownership: Afreen (Dashboard + Analytics)
import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIBugHealthInsight({ bugTypeDistribution = {}, totalBugs = 0, criticalBugs = 0 }) {
  // Find top bug category dynamically
  const entries = Object.entries(bugTypeDistribution);
  const topCategoryEntry = entries.length > 0
    ? entries.reduce((max, curr) => (curr[1] > max[1] ? curr : max), entries[0])
    : null;

  const topCategory = topCategoryEntry ? topCategoryEntry[0] : 'Logic Error';
  const topCategoryCount = topCategoryEntry ? topCategoryEntry[1] : 0;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-semibold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>AI Bug Health Insight</span>
            </span>
            {criticalBugs > 0 && (
              <span className="inline-flex items-center space-x-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold font-mono px-2.5 py-0.5 rounded-full">
                <span>{criticalBugs} Critical Action Required</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            {totalBugs > 0 ? (
              <>
                <span className="text-cyan-400">{topCategory}</span> concerns account for the highest volume of detected issues.
              </>
            ) : (
              <>All analyzed repositories currently present a clean code posture.</>
            )}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {totalBugs > 0
              ? `Automated static analysis indicates ${topCategoryCount} instance${topCategoryCount === 1 ? '' : 's'} of ${topCategory.toLowerCase()} detected across scanned modules. Prioritize regression fixes and input validation.`
              : 'Continuous inspection found zero active critical vulnerabilities across current build scans.'}
          </p>

          <div className="flex items-center space-x-2 pt-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Focus area →</span>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/60">
              {topCategory} & Validation
            </span>
          </div>
        </div>

        <div className="shrink-0 pt-2 md:pt-0">
          <Link
            to="/analyze"
            className="inline-flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md shadow-cyan-500/20"
          >
            <span>Run AI Code Scan</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
