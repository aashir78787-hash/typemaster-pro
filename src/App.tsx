// @ts-nocheck

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/Navbar';
import { LessonsView } from './components/LessonsView';
import { TypingTestView } from './components/TypingTestView';
import { GamesHubView } from './components/GamesHubView';
import { DashboardView } from './components/DashboardView';
import { LeaderboardView } from './components/LeaderboardView';
import { BadgesView } from './components/BadgesView';
import { SettingsModal } from './components/SettingsModal';
import { PlacementTestModal } from './components/PlacementTestModal';
import { BadgeUnlockedModal } from './components/BadgeUnlockedModal';
import { BookOpen, Timer, Gamepad2, TrendingUp, Crown, Award } from 'lucide-react';

export default function App() {
  const store = useAppStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);

  const activeTab = store.activeTab;
  const isLight = store.settings.theme === 'light';

  // Font family resolution: default to clean, friendly Lexend
  const fontClass =
    store.settings.fontFamily === 'mono'
      ? 'font-mono'
      : store.settings.fontFamily === 'serif'
      ? 'font-serif'
      : 'font-lexend';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col ${
        isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
      } ${fontClass}`}
    >
      {/* Top Bar with Instant Theme Toggle */}
      <Navbar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenPlacement={() => setPlacementOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col">
        {activeTab === 'lessons' && <LessonsView />}
        {activeTab === 'test' && <TypingTestView />}
        {activeTab === 'games' && <GamesHubView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'badges' && <BadgesView />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className={`md:hidden sticky bottom-0 z-40 border-t backdrop-blur-md px-2 py-2 flex items-center justify-around text-[10px] transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-600 shadow-md'
            : 'bg-slate-950/95 border-slate-800 text-slate-400'
        }`}
      >
        {[
          { id: 'lessons', label: 'Lessons', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'test', label: 'Test', icon: <Timer className="w-4 h-4" /> },
          { id: 'games', label: 'Games', icon: <Gamepad2 className="w-4 h-4" /> },
          { id: 'dashboard', label: 'Stats', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'leaderboard', label: 'Ranks', icon: <Crown className="w-4 h-4" /> },
          { id: 'badges', label: 'Badges', icon: <Award className="w-4 h-4" /> },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              store.setActiveGame(null);
              store.setTab(item.id as any);
            }}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? isLight
                  ? 'text-cyan-700 font-bold'
                  : 'text-cyan-400 font-bold'
                : isLight
                ? 'text-slate-500 hover:text-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Modals */}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
      {placementOpen && <PlacementTestModal onClose={() => setPlacementOpen(false)} />}
      <BadgeUnlockedModal />
    </div>
  );
}
