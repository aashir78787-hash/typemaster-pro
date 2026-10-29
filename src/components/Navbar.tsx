/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Sliders, Sparkles, Flame } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenPlacement: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, onOpenPlacement }) => {
  const store = useAppStore();
  const currentTab = store.activeTab;

  const navItems = [
    { id: 'lessons', label: 'Lessons' },
    { id: 'test', label: 'Typing Test' },
    { id: 'games', label: 'Games' },
    { id: 'dashboard', label: 'Analytics' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'badges', label: 'Badges' },
  ] as const;

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            store.setTab('lessons');
          }}
          className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 text-base font-black shadow-md shadow-cyan-500/20">
            T
          </span>
          <span>TypeMaster Pro</span>
        </a>

        {/* Practice Streak Counter */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-semibold">
          <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span>{store.streak.current}d</span>
        </div>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                store.setActiveGame(null);
                store.setTab(item.id);
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                isActive
                  ? 'text-cyan-400 border-cyan-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action with settings & placement trigger */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenPlacement}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-cyan-300 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Placement Test</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Customization & Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* User level pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs">
            {store.profile.avatar}
          </div>
          <span className="hidden xl:inline text-xs font-mono font-semibold text-slate-300">
            Lv.{store.profile.level}
          </span>
        </div>
      </div>
    </header>
  );
};
