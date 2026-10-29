/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Sliders, Sparkles, Flame, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenPlacement: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, onOpenPlacement }) => {
  const store = useAppStore();
  const currentTab = store.activeTab;
  const isLight = store.settings.theme === 'light';

  const navItems = [
    { id: 'lessons', label: 'Lessons' },
    { id: 'test', label: 'Typing Test' },
    { id: 'games', label: 'Games' },
    { id: 'dashboard', label: 'Analytics' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'badges', label: 'Badges' },
  ] as const;

  return (
    <header
      className={`flex items-center justify-between gap-8 px-6 py-3.5 border-b backdrop-blur-md sticky top-0 z-40 transition-colors ${
        isLight
          ? 'bg-white/90 border-slate-200 shadow-xs text-slate-800'
          : 'bg-slate-950/80 border-slate-800 text-slate-100'
      }`}
    >
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            store.setTab('lessons');
          }}
          className={`text-lg font-extrabold tracking-tight whitespace-nowrap shrink-0 flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-base font-black shadow-sm">
            T
          </span>
          <span>TypeMaster Pro</span>
        </a>

        {/* Practice Streak Counter */}
        <div
          className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
            isLight
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
          }`}
        >
          <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
          <span>{store.streak.current}d streak</span>
        </div>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav
        className={`hidden md:flex items-center gap-6 text-xs font-semibold ${
          isLight ? 'text-slate-600' : 'text-slate-300'
        }`}
      >
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
                  ? isLight
                    ? 'text-cyan-700 border-cyan-600 font-bold'
                    : 'text-cyan-400 border-cyan-400 font-bold'
                  : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action with theme switch, placement test, & settings */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Instant Theme Toggle (Light / Dark) */}
        <button
          onClick={() => store.toggleTheme()}
          className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-amber-600'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400'
          }`}
          title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          aria-label={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
        >
          {isLight ? <Sun className="w-4 h-4 fill-amber-500 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenPlacement}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
            isLight
              ? 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100'
              : 'bg-slate-900 border-slate-700 text-cyan-300 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Placement Test</span>
        </button>

        <button
          onClick={onOpenSettings}
          className={`p-2 rounded-lg border transition-colors ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
          title="Customization & Settings"
          aria-label="Customization & Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* User level badge */}
        <div className={`flex items-center gap-2 pl-2 border-l ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs border ${
              isLight
                ? 'bg-cyan-100 border-cyan-200 text-cyan-900'
                : 'bg-cyan-500/20 border-cyan-500/30 text-white'
            }`}
          >
            {store.profile.avatar}
          </div>
          <span
            className={`hidden xl:inline text-xs font-mono font-semibold ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}
          >
            Lv.{store.profile.level}
          </span>
        </div>
      </div>
    </header>
  );
};
