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
  AlertTriangle,
  Play,
  Calendar,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const store = useAppStore();
  const isLight = store.settings.theme === 'light';
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
      <div
        className={`p-6 rounded-2xl border shadow-sm flex flex-wrap items-center justify-between gap-6 transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border-slate-800 text-white'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl shadow-xs ${
              isLight
                ? 'bg-cyan-50 border-cyan-200 text-cyan-900'
                : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
            }`}
          >
            {store.profile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {store.profile.username}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${
                  isLight
                    ? 'bg-cyan-50 border-cyan-200 text-cyan-800'
                    : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
                }`}
              >
                Level {levelInfo.level}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {store.profile.email}
            </p>
          </div>
        </div>

        {/* Level & XP Progress */}
        <div className="flex flex-col gap-1.5 w-full md:w-64">
          <div className="flex justify-between text-xs font-mono">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>XP Progress</span>
            <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
              {levelInfo.currentXp} / {levelInfo.nextLevelXp} XP
            </span>
          </div>
          <div className={`h-2.5 rounded-full border overflow-hidden ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className={`p-5 rounded-2xl border shadow-xs flex items-center gap-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
              isLight
                ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}
          >
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Top Speed
            </div>
            <div className={`text-2xl font-extrabold font-mono mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {topWpm} WPM
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border shadow-xs flex items-center gap-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
              isLight
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Avg Accuracy
            </div>
            <div className={`text-2xl font-extrabold font-mono mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {avgAcc}%
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border shadow-xs flex items-center gap-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
              isLight
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Day Streak
            </div>
            <div className={`text-2xl font-extrabold font-mono mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {store.streak.current} Days
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border shadow-xs flex items-center gap-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
              isLight
                ? 'bg-purple-50 border-purple-200 text-purple-700'
                : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
            }`}
          >
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Practice Time
            </div>
            <div className={`text-2xl font-extrabold font-mono mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {timePracticedMinutes} min
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Weak Keys Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Speed Trend Chart */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm flex flex-col gap-4 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/80 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
                Velocity Progression (WPM)
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Your most recent performance sessions
              </p>
            </div>
            <div className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Avg: <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>{avgWpm} WPM</span>
            </div>
          </div>

          {/* SVG Line & Area Chart */}
          <div
            className={`w-full h-44 rounded-xl border p-2 flex items-center justify-center relative ${
              isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            {chartPoints.length > 1 ? (
              <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={isLight ? '0.25' : '0.4'} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="20" y1="30" x2="380" y2="30" stroke={isLight ? '#cbd5e1' : '#334155'} strokeDasharray="3 3" />
                <line x1="20" y1="85" x2="380" y2="85" stroke={isLight ? '#cbd5e1' : '#334155'} strokeDasharray="3 3" />
                <line x1="20" y1="140" x2="380" y2="140" stroke={isLight ? '#cbd5e1' : '#334155'} strokeDasharray="3 3" />

                <path d={areaD} fill="url(#cyanGrad)" />
                <path d={pathD} fill="none" stroke="#0891b2" strokeWidth="2.5" />

                {chartPoints.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#0891b2"
                    stroke={isLight ? '#ffffff' : '#0f172a'}
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
        <div
          className={`p-6 rounded-2xl border shadow-sm flex flex-col gap-4 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/80 border-slate-800 text-white'
          }`}
        >
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Weak Keys Diagnostic
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Keys with highest error frequency
            </p>
          </div>

          <div className="flex flex-col gap-2.5 flex-1">
            {weakKeys.length > 0 ? (
              weakKeys.map(k => {
                const stat = store.keyStats[k];
                const errorRate = Math.round((stat.errors / stat.hits) * 100);
                return (
                  <div
                    key={k}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isLight
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg border font-mono font-bold flex items-center justify-center text-sm uppercase ${
                          isLight
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        }`}
                      >
                        {k}
                      </div>
                      <div className="text-xs">
                        <div className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                          Key &apos;{k.toUpperCase()}&apos;
                        </div>
                        <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {stat.errors} errors in {stat.hits} presses
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-600">{errorRate}% Err</span>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-500 text-center my-auto py-8">
                No weak keys detected yet! Keep practicing to maintain high accuracy.
              </div>
            )}
          </div>

          <button
            onClick={() => {
              store.setActiveLesson(1);
              store.setTab('lessons');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Launch Adaptive Weak-Keys Drill
          </button>
        </div>
      </div>

      {/* Streak Calendar Activity Heatmap */}
      <div
        className={`p-6 rounded-2xl border shadow-sm flex flex-col gap-4 ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/80 border-slate-800 text-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Training Consistency Heatmap
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Daily practice frequency over the past 12 weeks
            </p>
          </div>
          <div className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Longest Streak:{' '}
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              {store.streak.longest} Days
            </span>
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
                className={`w-3.5 h-3.5 rounded-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 shadow-2xs'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200/70'
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
