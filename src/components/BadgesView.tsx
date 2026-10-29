/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BADGES } from '../data/badges';
import { useAppStore } from '../store/useAppStore';
import { Award, Lock, Trophy, Check } from 'lucide-react';

export const BadgesView: React.FC = () => {
  const store = useAppStore();
  const isLight = store.settings.theme === 'light';
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const unlockedCount = store.unlockedBadges.length;
  const totalCount = BADGES.length;

  const filteredBadges = BADGES.filter(b => {
    if (filterCategory === 'all') return true;
    return b.category === filterCategory;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div
        className={`p-6 rounded-2xl border flex flex-wrap items-center justify-between gap-4 transition-colors ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm text-slate-800'
            : 'bg-slate-900 border-slate-800 shadow-xl text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
              isLight
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            }`}
          >
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Achievements & Badges</h2>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Collect 28 prestigious badges by hitting typing speed, consistency, and game records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Unlocked:
          </span>
          <span
            className={`px-3 py-1 rounded-xl font-mono font-bold text-sm border ${
              isLight
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}
          >
            {unlockedCount} / {totalCount}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className={`flex items-center gap-1.5 p-1 rounded-xl border overflow-x-auto ${
          isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        {[
          { id: 'all', label: 'All Badges' },
          { id: 'speed', label: 'Speed' },
          { id: 'accuracy', label: 'Accuracy' },
          { id: 'streak', label: 'Streaks' },
          { id: 'lessons', label: 'Lessons' },
          { id: 'games', label: 'Games & Race' },
          { id: 'special', label: 'Special' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              filterCategory === cat.id
                ? isLight
                  ? 'bg-cyan-600 text-white font-bold shadow-xs'
                  : 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map(badge => {
          const isUnlocked = store.unlockedBadges.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 min-h-[160px] transition-all relative ${
                isUnlocked
                  ? isLight
                    ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                    : 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-950/30'
                  : isLight
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isUnlocked && (
                <div className="absolute top-3 right-3 text-emerald-600">
                  <Check className="w-4 h-4" />
                </div>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg border ${
                    isUnlocked
                      ? isLight
                        ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-xs'
                        : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h3
                    className={`text-sm font-bold ${
                      isUnlocked
                        ? isLight
                          ? 'text-slate-900'
                          : 'text-white'
                        : isLight
                        ? 'text-slate-700'
                        : 'text-slate-300'
                    }`}
                  >
                    {badge.name}
                  </h3>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      isLight ? 'text-amber-700' : 'text-amber-400'
                    }`}
                  >
                    +{badge.xp} XP
                  </span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {badge.description}
              </p>

              <div
                className={`flex items-center justify-between text-[10px] font-mono pt-2 border-t ${
                  isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-500'
                }`}
              >
                <span className="uppercase">{badge.category}</span>
                <span className={isUnlocked ? (isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-bold') : ''}>
                  {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
