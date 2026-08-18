// Ownership: Afreen (Dashboard + Analytics)
import React from 'react';
import { FileCode, CheckCircle, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SEVERITY_BADGES = {
  CRITICAL: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  MEDIUM: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  LOW: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  CLEAN: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
};

const LANG_COLORS = {
  Python: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
  JavaScript: 'text-yellow-300 bg-yellow-400/10 border-yellow-400/20',
  TypeScript: 'text-blue-300 bg-blue-400/10 border-blue-400/20',
  Java: 'text-orange-300 bg-orange-400/10 border-orange-400/20',
  'C++': 'text-purple-300 bg-purple-400/10 border-purple-400/20'
};

export default function RecentAnalysis({ analyses = [] }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">Recent Analyses</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Latest automated security and static code audits</p>
        </div>
        <Link
          to="/analyze"
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
        >
          <span>New Analysis</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-mono">
          No recent analysis records found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">File / Target</th>
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Language</th>
                <th className="py-3 px-3 text-center">Bugs</th>
                <th className="py-3 px-3">Highest Severity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {analyses.map((item, idx) => {
                const severity = item.severity || (item.bug_count === 0 ? 'CLEAN' : 'LOW');
                const langClass = LANG_COLORS[item.language] || 'text-slate-300 bg-slate-800 border-slate-700';
                const severityClass = SEVERITY_BADGES[severity.toUpperCase()] || SEVERITY_BADGES.LOW;

                return (
                  <tr key={item.id || idx} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3 px-3 font-medium text-white flex items-center space-x-2">
                      <FileCode className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span className="truncate max-w-[140px]" title={item.file || item.file_name}>
                        {item.file || item.file_name || 'audit.py'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans font-medium">
                      {item.project || item.project_name || 'Core Repository'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${langClass}`}>
                        {item.language || 'Python'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.bug_count > 0 ? 'bg-slate-800 text-slate-200' : 'bg-emerald-950/60 text-emerald-400'
                        }`}
                      >
                        {item.bug_count ?? item.bugs_found ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${severityClass}`}>
                        {severity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1.5 font-sans">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="capitalize text-slate-300 text-[11px]">{item.status || 'Completed'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-sans text-[11px]">
                      {item.date || item.created_at || 'Just now'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

