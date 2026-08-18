// Ownership: Afreen (Dashboard + Analytics)
import React from 'react';
import { FolderGit2, ShieldCheck, ShieldAlert, Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ projects = [] }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <FolderGit2 className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">Project Overview</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Monitored repositories & static code health</p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50">
          {projects.length} Monitored
        </span>
      </div>

      {/* Project list */}
      {projects.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-mono">
          No projects registered.
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
          {projects.map((proj, idx) => {
            const hasCritical = proj.critical_count > 0;
            const hasBugs = proj.bug_count > 0;

            return (
              <div
                key={proj.id || idx}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-lg p-3.5 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg border ${
                      hasCritical
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        : hasBugs
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {hasCritical ? (
                      <ShieldAlert className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {proj.name}
                    </h4>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1 font-mono">
                      <span>{proj.analysis_count ?? 0} scans</span>
                      <span>•</span>
                      <span className={hasBugs ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                        {proj.bug_count ?? 0} bugs
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center space-x-2">
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {proj.last_scan || 'Recently'}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        hasCritical ? 'text-rose-400' : hasBugs ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {hasCritical ? 'Critical' : hasBugs ? 'Action Needed' : 'Healthy'}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

