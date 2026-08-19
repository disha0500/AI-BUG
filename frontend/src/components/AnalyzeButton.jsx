import React from 'react';

export default function AnalyzeButton({ onClick, isLoading, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium text-sm transition shadow-lg ${
        isLoading || disabled
          ? 'bg-indigo-900/50 text-indigo-300 cursor-not-allowed border border-indigo-700/50'
          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 active:scale-95'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Analyzing Codebase...</span>
        </span>
      ) : (
        <span className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Run AI Analysis</span>
        </span>
      )}
    </button>
  );
}