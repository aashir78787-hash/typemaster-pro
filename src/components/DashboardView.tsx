/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore, getLevelForXp } from '../store/useAppStore';
import {
  TrendingUp,
  Target,
  Zap,
  Clock,
  Flame,
  Award,
  AlertTriangle,
  Play,
  Calendar,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const store = useAppStore();
  const results = store.testResults;
  const levelInfo = getLevelForXp(store.profile.xp);

  // Compute averages
  const totalTests = results.length;
  const avgWpm = totalTests > 0 ? Math.round(results.reduce((s, r) => s + r.wpm, 0) / totalTests) : 0;
  const topWpm = totalTests > 0 ? Math.max(...results.map(r => r.wpm)) : 0;
  const avgAcc = totalTests > 0 ? Math.round((results.reduce((s, r) => s + r.accuracy, 0) / totalTests) * 10) / 10 : 100;
  const totalSeconds = results.reduce((s, r) => s + r.timeSec, 0);
  const timePracticedMinutes = Math.round(totalSeconds / 60);

  // Weak keys
  const weakKeys = store.getWeakKeys(0.1);

  // SVG Chart data for WPM history
  const chartResults = [...results].reverse().slice(-10);
  const chartPoints = chartResults.map((r, i) => {
    const x = (i / Math.max(1, chartResults.length - 1)) * 360 + 20;
    const maxVal = Math.max(80, topWpm + 10);
    const y = 140 - (r.wpm / maxVal) * 110;
    return { x, y, wpm: r.wpm, date: r.date };
  });

  const pathD = chartPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = chartPoints.length > 0
    ? `${pathD} L ${chartPoints[chartPoints.length - 1].x} 150 L ${chartPoints[0].x} 150 Z`
    : '';

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Profile & Level Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-inner">
            {store.profile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{store.profile.username}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Level {levelInfo.level}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{store.profile.email}</p>
          </div>
        </div>

        {/* Level & XP Progress */}
        <div className="flex flex-col gap-1.5 w-full md:w-64">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">XP Progress</span>
            <span className="text-cyan-400 font-bold">{levelInfo.currentXp} / {levelInfo.nextLevelXp} XP</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Top Speed</div>
            <div className="text-2xl font-extrabold font-mono text-white mt-0.5">{topWpm} WPM</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Avg Accuracy</div>
            <div className="text-2xl font-extrabold font-mono text-white mt-0.5">{avgAcc}%</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Day Streak</div>
            <div className="text-2xl font-extrabold font-mono text-white mt-0.5">{store.streak.current} Days</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Practice Time</div>
            <div className="text-2xl font-extrabold font-mono text-white mt-0.5">{timePracticedMinutes} min</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Weak Keys Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Speed Trend Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Velocity Progression (WPM)
              </h3>
              <p className="text-xs text-slate-400">Your most recent tests</p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Avg: <span className="text-cyan-400 font-bold">{avgWpm} WPM</span>
            </div>
          </div>

          {/* SVG Line & Area Chart */}
          <div className="w-full h-44 bg-slate-950/60 rounded-xl border border-slate-800 p-2 flex items-center justify-center relative">
            {chartPoints.length > 1 ? (
              <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference lines */}
                <line x1="20" y1="30" x2="380" y2="30" stroke="#334155" strokeDasharray="3 3" />
                <line x1="20" y1="85" x2="380" y2="85" stroke="#334155" strokeDasharray="3 3" />
                <line x1="20" y1="140" x2="380" y2="140" stroke="#334155" strokeDasharray="3 3" />

                {/* Filled Area */}
                <path d={areaD} fill="url(#cyanGrad)" />
                {/* Stroke Line */}
                <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="2.5" />

                {/* Data Points */}
                {chartPoints.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#38bdf8"
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            ) : (
              <div className="text-xs text-slate-500 font-mono">
                Take a few typing tests to populate velocity progression charts.
              </div>
            )}
          </div>
        </div>

        {/* Weak Keys Matrix */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Weak Keys Diagnostic
            </h3>
            <p className="text-xs text-slate-400">Keys with highest error frequency</p>
          </div>

          <div className="flex flex-col gap-2.5 flex-1">
            {weakKeys.length > 0 ? (
              weakKeys.map(k => {
                const stat = store.keyStats[k];
                const errorRate = Math.round((stat.errors / stat.hits) * 100);
                return (
                  <div
                    key={k}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold flex items-center justify-center text-sm uppercase">
                        {k}
                      </div>
                      <div className="text-xs">
                        <div className="font-semibold text-slate-200">Key &apos;{k.toUpperCase()}&apos;</div>
                        <div className="text-[10px] text-slate-400">{stat.errors} errors in {stat.hits} presses</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-400">{errorRate}% Err</span>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-500 text-center my-auto py-8">
                No weak keys detected yet! Maintain high accuracy to keep your keyboard tuned.
              </div>
            )}
          </div>

          <button
            onClick={() => {
              store.setActiveLesson(1);
              store.setTab('lessons');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Launch Adaptive Weak-Keys Drill
          </button>
        </div>
      </div>

      {/* Streak Calendar Activity Heatmap */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Training Consistency Heatmap
            </h3>
            <p className="text-xs text-slate-400">Daily practice frequency over the past 12 weeks</p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Longest Streak: <span className="text-emerald-400 font-bold">{store.streak.longest} Days</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2">
          {[...Array(84)].map((_, dayIdx) => {
            const date = new Date(Date.now() - (83 - dayIdx) * 86400000);
            const dateStr = date.toISOString().split('T')[0];
            const isActive = store.streak.activeDates.includes(dateStr);

            return (
              <div
                key={dayIdx}
                title={`${dateStr}: ${isActive ? 'Practiced' : 'No activity'}`}
                className={`w-3.5 h-3.5 rounded-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                    : 'bg-slate-800/80 hover:bg-slate-700'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
