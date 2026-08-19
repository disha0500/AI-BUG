import React from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, language }) {
  return (
    <div className="h-[460px] w-full border border-slate-700 rounded-b-lg overflow-hidden bg-[#1e1e1e] shadow-inner">
      <Editor
        height="100%"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={(val) => onChange(val || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}