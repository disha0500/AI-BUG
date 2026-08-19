import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import LanguageSelector from '../components/LanguageSelector';
import AnalyzeButton from '../components/AnalyzeButton';
import AnalysisProgress from '../components/AnalysisProgress';
import AnalysisSummary from '../components/AnalysisSummary';

const SAMPLES = {
  'auth-bypass': {
    lang: 'python',
    code: `def verify_user(token, admin_override=False):\n    # BUG: Overriding parameter can lead to unauthorized elevation\n    if admin_override == True or token == "MASTER_SECRET":\n        return {"status": "authenticated", "role": "admin"}\n    \n    user = fetch_user_by_token(token)\n    return {"status": "authenticated", "role": user.role}`,
  },
  'null-pointer': {
    lang: 'javascript',
    code: `function getUserProfile(userResponse) {\n  // BUG: Direct access without null check\n  const profile = userResponse.data.profile;\n  const avatar = profile.images.avatar.url;\n  return { avatar, username: profile.name };\n}`,
  },
  'sql-injection': {
    lang: 'python',
    code: `import sqlite3\n\ndef search_records(query_param):\n    conn = sqlite3.connect('app.db')\n    cursor = conn.cursor()\n    # BUG: SQL Injection via string interpolation\n    query = f"SELECT * FROM users WHERE name LIKE '%{query_param}%'"\n    cursor.execute(query)\n    return cursor.fetchall()`,
  },
};

export default function AnalysisPage() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(SAMPLES['auth-bypass'].code);
  const [isLoading, setIsLoading] = useState(false);
  const [progressStage, setProgressStage] = useState(1);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleSampleSelect = (sampleKey) => {
    const sample = SAMPLES[sampleKey];
    if (sample) {
      setLanguage(sample.lang);
      setCode(sample.code);
      setAnalysisResult(null);
      setError(null);
    }
  };

  const runPipelineStages = async () => {
    setProgressStage(1);
    await new Promise((r) => setTimeout(r, 400));
    setProgressStage(2);
    await new Promise((r) => setTimeout(r, 500));
    setProgressStage(3);
    await new Promise((r) => setTimeout(r, 600));
    setProgressStage(4);
    await new Promise((r) => setTimeout(r, 400));
    setProgressStage(5);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please provide code before running analysis.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const pipelinePromise = runPipelineStages();

      const apiPromise = fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        return res.json();
      });

      const [, responseData] = await Promise.all([pipelinePromise, apiPromise]);
      setAnalysisResult(responseData);
    } catch (err) {
      console.error('Analysis fallback active:', err);
      setError('Backend API is not connected. Showing simulated analysis result for demo.');
      setAnalysisResult({
        bugs: [
          {
            id: 'bug-1',
            type: 'Logic Error & Privilege Escalation',
            severity: 'Critical',
            line: 3,
            confidence: 94,
            description: 'admin_override parameter is unvalidated and allows arbitrary privilege escalation.',
          },
        ],
        stats: { critical: 1, high: 0, medium: 0, low: 0 },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Code Bug Analysis</h1>
            <p className="text-sm text-slate-400">
              Input source code for automated static analysis and AI-driven bug detection.
            </p>
          </div>
          <AnalyzeButton onClick={handleAnalyze} isLoading={isLoading} disabled={!code.trim()} />
        </div>

        {error && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-amber-400 hover:text-amber-200 font-bold ml-2">
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col">
            <LanguageSelector
              selectedLanguage={language}
              onSelectLanguage={setLanguage}
              onSelectSample={handleSampleSelect}
            />
            <CodeEditor code={code} onChange={setCode} language={language} />
          </div>

          <div className="space-y-6">
            {isLoading && <AnalysisProgress currentStage={progressStage} />}
            <AnalysisSummary
              analysisResult={analysisResult}
              onSelectBug={(bug) => console.log('Selected Bug:', bug)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}