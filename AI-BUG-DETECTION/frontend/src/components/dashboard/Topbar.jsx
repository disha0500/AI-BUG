// Ownership: Afreen (Dashboard + Analytics)
import React from 'react';
import { Bell, Activity, Shield, RefreshCw } from 'lucide-react';

export default function Topbar({ onRefresh, isRefreshing }) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-10">
      {/* System Status Indicator */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-mono font-medium">AI Diagnostic Engine Operational</span>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center space-x-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono text-slate-300 bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Metrics"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        )}

        <button className="text-slate-400 hover:text-white transition p-2 hover:bg-slate-800/60 rounded-lg relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-500" />
        </button>

        <div className="h-5 w-px bg-slate-800" />

        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-xs font-bold font-mono text-cyan-400 shadow-sm">
            AF
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-slate-200 block leading-tight">Afreen</span>
            <span className="text-[10px] text-slate-400 font-mono block">Frontend Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}

