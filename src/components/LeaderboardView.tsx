/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Trophy, Medal, Crown, Flame, Search } from 'lucide-react';

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
  const [scope, setScope] = useState<'global' | 'weekly' | 'friends'>('global');
  const [searchQuery, setSearchQuery] = useState('');

  const bestUserWpm = Math.max(0, ...store.testResults.map(r => r.wpm));

  const filteredLeaders = GLOBAL_LEADERS.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Global Hall of Fame</h2>
            <p className="text-xs text-slate-400">
              The world&apos;s fastest touch typists ranked by verified WPM and consistency.
            </p>
          </div>
        </div>

        {/* Scope Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
          {(['global', 'weekly', 'friends'] as const).map(s => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                scope === s
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
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
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search typists by username..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Leaderboard Table Container */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 text-center">Rank</th>
              <th className="py-3 px-4">Typist</th>
              <th className="py-3 px-4 text-center">Velocity</th>
              <th className="py-3 px-4 text-center">Accuracy</th>
              <th className="py-3 px-4 text-center">Races Won</th>
              <th className="py-3 px-4 text-right">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredLeaders.map(user => {
              const isTop3 = user.rank <= 3;

              return (
                <tr
                  key={user.rank}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    user.rank === 1 ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center">
                    {user.rank === 1 && <span className="text-amber-400 font-bold text-sm">🥇 #1</span>}
                    {user.rank === 2 && <span className="text-slate-300 font-bold text-sm">🥈 #2</span>}
                    {user.rank === 3 && <span className="text-amber-600 font-bold text-sm">🥉 #3</span>}
                    {user.rank > 3 && <span className="text-slate-500 font-bold">#{user.rank}</span>}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{user.avatar}</span>
                      <div>
                        <div className="font-bold text-white text-xs flex items-center gap-1.5">
                          {user.username} <span>{user.country}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center text-cyan-400 font-bold text-sm">
                    {user.wpm} WPM
                  </td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">
                    {user.accuracy}%
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-300">
                    {user.racesWon}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {user.badgeTitle}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Pinned User Row */}
            <tr className="bg-cyan-950/40 border-t-2 border-cyan-500/40">
              <td className="py-3.5 px-4 text-center font-bold text-cyan-400">
                #42
              </td>
              <td className="py-3.5 px-4 font-sans">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{store.profile.avatar}</span>
                  <div>
                    <div className="font-bold text-white text-xs">
                      {store.profile.username} (You)
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4 text-center text-cyan-400 font-bold text-sm">
                {bestUserWpm} WPM
              </td>
              <td className="py-3.5 px-4 text-center text-emerald-400">
                {store.testResults[0]?.accuracy || 98}%
              </td>
              <td className="py-3.5 px-4 text-center text-slate-300">
                {store.gameScores['race'] || 0}
              </td>
              <td className="py-3.5 px-4 text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
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
