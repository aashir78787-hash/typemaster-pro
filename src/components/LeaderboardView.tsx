/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Crown, Search } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  wpm: number;
  accuracy: number;
  racesWon: number;
  country: string;
  badgeTitle: string;
}

const GLOBAL_LEADERS: LeaderboardUser[] = [
  { rank: 1, username: 'QuantumTyper', avatar: '⚡', wpm: 142, accuracy: 99.4, racesWon: 340, country: '🇺🇸', badgeTitle: 'Grandmaster' },
  { rank: 2, username: 'SakuraSwift', avatar: '🌸', wpm: 136, accuracy: 98.9, racesWon: 290, country: '🇯🇵', badgeTitle: 'Grandmaster' },
  { rank: 3, username: 'ValkyrieKeys', avatar: '🛡️', wpm: 128, accuracy: 99.1, racesWon: 215, country: '🇸🇪', badgeTitle: 'Century Club' },
  { rank: 4, username: 'NeonMatrix', avatar: '👾', wpm: 122, accuracy: 97.8, racesWon: 180, country: '🇩🇪', badgeTitle: 'Century Club' },
  { rank: 5, username: 'KeyboardRonin', avatar: '🗡️', wpm: 118, accuracy: 98.2, racesWon: 145, country: '🇰🇷', badgeTitle: 'Century Club' },
  { rank: 6, username: 'ApexFalcon', avatar: '🦅', wpm: 112, accuracy: 97.5, racesWon: 110, country: '🇨🇦', badgeTitle: 'Hyper Velocity' },
  { rank: 7, username: 'SpeedDemon99', avatar: '🔥', wpm: 106, accuracy: 98.0, racesWon: 95, country: '🇬🇧', badgeTitle: 'Hyper Velocity' },
  { rank: 8, username: 'PixelTypist', avatar: '🕹️', wpm: 98, accuracy: 96.8, racesWon: 74, country: '🇦🇺', badgeTitle: 'Speed Demon' },
];

export const LeaderboardView: React.FC = () => {
  const store = useAppStore();
  const isLight = store.settings.theme === 'light';
  const [scope, setScope] = useState<'global' | 'weekly' | 'friends'>('global');
  const [searchQuery, setSearchQuery] = useState('');

  const bestUserWpm = Math.max(0, ...store.testResults.map(r => r.wpm));

  const filteredLeaders = GLOBAL_LEADERS.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Global Hall of Fame</h2>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              The world&apos;s fastest touch typists ranked by verified WPM and consistency.
            </p>
          </div>
        </div>

        {/* Scope Tabs */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          {(['global', 'weekly', 'friends'] as const).map(s => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                scope === s
                  ? isLight
                    ? 'bg-white text-cyan-800 shadow-xs font-bold'
                    : 'bg-cyan-500 text-slate-950 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search typists by username..."
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-xs ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          }`}
        />
      </div>

      {/* Leaderboard Table Container */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-sm ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        <table className="w-full text-left text-xs">
          <thead
            className={`font-mono uppercase text-[10px] border-b ${
              isLight
                ? 'bg-slate-50 text-slate-500 border-slate-200'
                : 'bg-slate-950/80 text-slate-400 border-slate-800'
            }`}
          >
            <tr>
              <th className="py-3 px-4 text-center">Rank</th>
              <th className="py-3 px-4">Typist</th>
              <th className="py-3 px-4 text-center">Velocity</th>
              <th className="py-3 px-4 text-center">Accuracy</th>
              <th className="py-3 px-4 text-center">Races Won</th>
              <th className="py-3 px-4 text-right">Tier</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-mono ${isLight ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
            {filteredLeaders.map(user => {
              return (
                <tr
                  key={user.rank}
                  className={`transition-colors ${
                    isLight ? 'hover:bg-slate-50/80' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3.5 px-4 text-center">
                    {user.rank === 1 && <span className="text-amber-500 font-bold text-sm">🥇 #1</span>}
                    {user.rank === 2 && <span className="text-slate-400 font-bold text-sm">🥈 #2</span>}
                    {user.rank === 3 && <span className="text-amber-700 font-bold text-sm">🥉 #3</span>}
                    {user.rank > 3 && <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>#{user.rank}</span>}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{user.avatar}</span>
                      <div>
                        <div className={`font-bold text-xs flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {user.username} <span>{user.country}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`py-3.5 px-4 text-center font-bold text-sm ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                    {user.wpm} WPM
                  </td>
                  <td className={`py-3.5 px-4 text-center ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                    {user.accuracy}%
                  </td>
                  <td className={`py-3.5 px-4 text-center ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {user.racesWon}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-sans font-semibold border ${
                        isLight
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {user.badgeTitle}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Pinned User Row */}
            <tr
              className={`border-t-2 ${
                isLight
                  ? 'bg-cyan-50/70 border-cyan-300 text-slate-900'
                  : 'bg-cyan-950/40 border-cyan-500/40 text-white'
              }`}
            >
              <td className={`py-3.5 px-4 text-center font-bold ${isLight ? 'text-cyan-800' : 'text-cyan-400'}`}>
                #42
              </td>
              <td className="py-3.5 px-4 font-sans">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{store.profile.avatar}</span>
                  <div>
                    <div className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {store.profile.username} (You)
                    </div>
                  </div>
                </div>
              </td>
              <td className={`py-3.5 px-4 text-center font-bold text-sm ${isLight ? 'text-cyan-800' : 'text-cyan-400'}`}>
                {bestUserWpm} WPM
              </td>
              <td className={`py-3.5 px-4 text-center ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                {store.testResults[0]?.accuracy || 98}%
              </td>
              <td className={`py-3.5 px-4 text-center ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                {store.gameScores['race'] || 0}
              </td>
              <td className="py-3.5 px-4 text-right">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-sans font-semibold border ${
                    isLight
                      ? 'bg-cyan-100 text-cyan-900 border-cyan-200'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  Level {store.profile.level} Typist
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
