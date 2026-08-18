// Ownership: Afreen (Dashboard + Analytics)
import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color = 'text-white', badge, bgAccent }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all duration-200 shadow-sm relative overflow-hidden group">
      {bgAccent && (
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none ${bgAccent}`} />
      )}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
          <h3 className={`text-3xl font-extrabold tracking-tight ${color}`}>{value}</h3>
          {subtext && <p className="text-xs text-slate-400 font-medium pt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300 group-hover:text-white group-hover:border-slate-600 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {badge && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">{badge.label}</span>
          <span className={`font-semibold ${badge.color || 'text-slate-300'}`}>{badge.value}</span>
        </div>
      )}
    </div>
  );
}

