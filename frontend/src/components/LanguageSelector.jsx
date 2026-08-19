import React from 'react';

const LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
];

export default function LanguageSelector({ selectedLanguage, onSelectLanguage, onSelectSample }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-800 border-b border-slate-700 rounded-t-lg">
      <div className="flex items-center space-x-2">
        <label htmlFor="language-select" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Language:
        </label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => onSelectLanguage(e.target.value)}
          className="bg-slate-900 text-slate-100 text-sm rounded-md px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-xs text-slate-400">Load Demo Bug:</span>
        <button
          type="button"
          onClick={() => onSelectSample('auth-bypass')}
          className="text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
        >
          Auth Bypass
        </button>
        <button
          type="button"
          onClick={() => onSelectSample('null-pointer')}
          className="text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
        >
          Null Pointer
        </button>
        <button
          type="button"
          onClick={() => onSelectSample('sql-injection')}
          className="text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
        >
          SQL Injection
        </button>
      </div>
    </div>
  );
}