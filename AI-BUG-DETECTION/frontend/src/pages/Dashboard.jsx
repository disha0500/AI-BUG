// Ownership: Afreen (Dashboard + Analytics)
import React, { useState, useEffect, useCallback } from 'react';
import {
  Database,
  Terminal,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Layers,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Filter
} from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import BugChart from '../components/dashboard/BugChart';
import RecentAnalysis from '../components/dashboard/RecentAnalysis';
import ProjectCard from '../components/dashboard/ProjectCard';
import AIBugHealthInsight from '../components/dashboard/AIBugHealthInsight';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_projects: 4,
    total_analyses: 18,
    total_bugs: 9,
    critical_bugs: 2,
    high_bugs: 3,
    medium_bugs: 3,
    low_bugs: 1,
    bug_severity_distribution: {
      CRITICAL: 2,
      HIGH: 3,
      MEDIUM: 3,
      LOW: 1
    },
    bug_type_distribution: {
      "Logic Error": 4,
      "Security Vulnerability": 2,
      "Runtime Error": 2,
      "Input Validation": 1
    },
    recent_analyses: [
      { id: "AN-084", project: "Auth Engine", file: "jwt_validator.py", language: "Python", bug_count: 3, severity: "CRITICAL", status: "completed", date: "10 mins ago" },
      { id: "AN-083", project: "Payment Gateway", file: "checkout.js", language: "JavaScript", bug_count: 1, severity: "HIGH", status: "completed", date: "45 mins ago" },
      { id: "AN-082", project: "Data Pipeline", file: "spark_transform.py", language: "Python", bug_count: 4, severity: "MEDIUM", status: "completed", date: "2 hours ago" },
      { id: "AN-081", project: "User Portal", file: "user_controller.ts", language: "TypeScript", bug_count: 1, severity: "LOW", status: "completed", date: "5 hours ago" }
    ]
  });

  const [projects, setProjects] = useState([
    { id: "p1", name: "E-Commerce Gateway", analysis_count: 8, bug_count: 4, critical_count: 1, last_scan: "10 mins ago" },
    { id: "p2", name: "Auth & Identity Core", analysis_count: 5, bug_count: 3, critical_count: 1, last_scan: "45 mins ago" },
    { id: "p3", name: "Analytics ETL Pipeline", analysis_count: 3, bug_count: 2, critical_count: 0, last_scan: "2 hours ago" },
    { id: "p4", name: "Customer Portal Services", analysis_count: 2, bug_count: 0, critical_count: 0, last_scan: "1 day ago" }
  ]);

  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Attempt API calls
      const [dashData, projectsData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getProjects().catch(() => null)
      ]);

      if (dashData && typeof dashData === 'object') {
        setStats(prev => ({
          ...prev,
          ...dashData,
          bug_severity_distribution: dashData.bug_severity_distribution || prev.bug_severity_distribution,
          bug_type_distribution: dashData.bug_type_distribution || prev.bug_type_distribution,
          recent_analyses: (dashData.recent_analyses && dashData.recent_analyses.length > 0)
            ? dashData.recent_analyses
            : prev.recent_analyses
        }));
      }

      if (projectsData && Array.isArray(projectsData) && projectsData.length > 0) {
        setProjects(projectsData.map(p => ({
          id: p.id || p._id,
          name: p.name || 'Unnamed Project',
          analysis_count: p.analysis_count || 1,
          bug_count: p.bug_count || 0,
          critical_count: p.critical_count || 0,
          last_scan: p.last_scan || 'Recently'
        })));
      }
    } catch (err) {
      console.warn("Using isolated dashboard mock layer fallback:", err);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Format data for Recharts components
  const severityChartData = [
    { name: 'Critical', value: stats.bug_severity_distribution?.CRITICAL ?? stats.critical_bugs ?? 0, color: '#ef4444' },
    { name: 'High', value: stats.bug_severity_distribution?.HIGH ?? stats.high_bugs ?? 0, color: '#f97316' },
    { name: 'Medium', value: stats.bug_severity_distribution?.MEDIUM ?? stats.medium_bugs ?? 0, color: '#eab308' },
    { name: 'Low', value: stats.bug_severity_distribution?.LOW ?? stats.low_bugs ?? 0, color: '#3b82f6' }
  ];

  const bugTypeChartData = Object.entries(stats.bug_type_distribution || {}).map(([name, value], idx) => ({
    name,
    value
  }));

  const totalBugsCount = stats.total_bugs ?? (
    (stats.critical_bugs || 0) + (stats.high_bugs || 0) + (stats.medium_bugs || 0) + (stats.low_bugs || 0)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* 1. Header & Title Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Dashboard Overview</span>
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Monitor your projects, analyses and code security posture.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-slate-400 hidden md:inline">
            Last synced: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={stats.total_projects}
          subtext="Projects monitored"
          icon={Database}
          color="text-white"
          bgAccent="bg-blue-500"
          badge={{ label: "Status", value: "Active", color: "text-emerald-400" }}
        />
        <StatCard
          title="Total Analyses"
          value={stats.total_analyses}
          subtext="Code scans completed"
          icon={Terminal}
          color="text-white"
          bgAccent="bg-cyan-500"
          badge={{ label: "Audit Engine", value: "v2.4", color: "text-cyan-400" }}
        />
        <StatCard
          title="Total Bugs"
          value={totalBugsCount}
          subtext="Detected issues"
          icon={ShieldAlert}
          color="text-amber-400"
          bgAccent="bg-amber-500"
          badge={{ label: "Resolved", value: "14 fixed", color: "text-slate-400" }}
        />
        <StatCard
          title="Critical Severity"
          value={stats.critical_bugs ?? stats.bug_severity_distribution?.CRITICAL ?? 0}
          subtext="Needs immediate attention"
          icon={AlertTriangle}
          color="text-rose-400"
          bgAccent="bg-rose-500"
          badge={{
            label: "Priority",
            value: (stats.critical_bugs > 0 ? "Action Required" : "None"),
            color: (stats.critical_bugs > 0 ? "text-rose-400 font-bold" : "text-emerald-400")
          }}
        />
      </div>

      {/* 3. Severity Overview Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Severity Breakdown</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time classification</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Critical */}
          <div className="bg-slate-950/80 border border-rose-500/20 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">Critical</span>
              <span className="text-2xl font-bold font-mono text-white mt-0.5 block">
                {stats.bug_severity_distribution?.CRITICAL ?? stats.critical_bugs ?? 0}
              </span>
            </div>
            <div className="h-3 w-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          </div>

          {/* High */}
          <div className="bg-slate-950/80 border border-orange-500/20 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider block">High</span>
              <span className="text-2xl font-bold font-mono text-white mt-0.5 block">
                {stats.bug_severity_distribution?.HIGH ?? stats.high_bugs ?? 0}
              </span>
            </div>
            <div className="h-3 w-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
          </div>

          {/* Medium */}
          <div className="bg-slate-950/80 border border-yellow-500/20 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-yellow-400 uppercase tracking-wider block">Medium</span>
              <span className="text-2xl font-bold font-mono text-white mt-0.5 block">
                {stats.bug_severity_distribution?.MEDIUM ?? stats.medium_bugs ?? 0}
              </span>
            </div>
            <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/50" />
          </div>

          {/* Low */}
          <div className="bg-slate-950/80 border border-blue-500/20 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">Low</span>
              <span className="text-2xl font-bold font-mono text-white mt-0.5 block">
                {stats.bug_severity_distribution?.LOW ?? stats.low_bugs ?? 0}
              </span>
            </div>
            <div className="h-3 w-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
          </div>
        </div>
      </div>

      {/* 4. Bug Visualizations Twin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BugChart
          title="Bug Severity Distribution"
          subtitle="Frequency breakdown by severity level"
          data={severityChartData}
          chartType="bar"
          icon={ShieldAlert}
        />
        <BugChart
          title="Bug Type Distribution"
          subtitle="Categorized by static analysis vulnerability patterns"
          data={bugTypeChartData}
          chartType="horizontal-bar"
          icon={Layers}
        />
      </div>

      {/* 5. AI Bug Health Insight Card */}
      <AIBugHealthInsight
        bugTypeDistribution={stats.bug_type_distribution}
        totalBugs={totalBugsCount}
        criticalBugs={stats.critical_bugs || 0}
      />

      {/* 6. Recent Analyses & Project Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAnalysis analyses={stats.recent_analyses} />
        </div>
        <div className="lg:col-span-1">
          <ProjectCard projects={projects} />
        </div>
      </div>
    </div>
  );
}
