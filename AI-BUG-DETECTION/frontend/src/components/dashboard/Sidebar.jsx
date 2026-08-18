// Ownership: Afreen (Dashboard + Analytics)
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Code, ShieldAlert, Settings, HelpCircle, Terminal, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Code Analysis', path: '/analyze', icon: Code },
    { name: 'Detected Bugs', path: '/bugs', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-20 shrink-0 select-none">
      <div className="flex-1 py-6 flex flex-col">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 px-6 mb-8">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-white text-sm tracking-wider block font-mono">AI BUG DETECTOR</span>
            <span className="text-[10px] text-slate-400 font-mono block">Enterprise v1.0</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Core Platform</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/80 space-y-1.5 bg-slate-950/40">
        <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800/80 mb-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
            <span>Engine Engine</span>
            <span className="text-emerald-400 font-bold">Online</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-full animate-pulse" />
          </div>
        </div>
        <button className="flex items-center space-x-3 w-full px-3.5 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg text-xs font-medium transition-colors">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
        <button className="flex items-center space-x-3 w-full px-3.5 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg text-xs font-medium transition-colors">
          <HelpCircle className="h-4 w-4" />
          <span>Documentation</span>
        </button>
      </div>
    </aside>
  );
}

