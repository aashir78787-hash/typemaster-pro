/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { TypingRaceGame } from './games/TypingRaceGame';
import { ArcadeGames } from './games/ArcadeGames';
import {
  Gamepad2,
  Flag,
  CloudRain,
  Compass,
  ShieldAlert,
  Shuffle,
  AlertOctagon,
  Crosshair,
  ArrowLeft,
  Trophy,
  Play,
} from 'lucide-react';

interface GameCardDef {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
}

const GAMES: GameCardDef[] = [
  {
    id: 'race',
    title: 'Typing Race Grand Prix',
    description: 'Flagship top-down race. Compete against tuned AI bots or create a multiplayer room!',
    icon: <Flag className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
    tag: 'Flagship Multiplayer',
  },
  {
    id: 'wordrain',
    title: 'Falling Words (Word Rain)',
    description: 'Words drop from the clouds. Type and eliminate them before they hit the ground!',
    icon: <CloudRain className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    tag: 'Arcade Classic',
  },
  {
    id: 'balloon',
    title: 'Balloon Pop',
    description: 'Floating colorful balloons. Type fast to pop them before they float out of the sky!',
    icon: <Compass className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
    tag: 'Casual Speed',
  },
  {
    id: 'zombie',
    title: 'Zombie Defense',
    description: 'Undead walkers march toward your gate. Type words to fire blasters and defeat the boss wave!',
    icon: <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
    tag: 'Survival Action',
  },
  {
    id: 'scramble',
    title: 'Word Scramble / Speed Spell',
    description: 'Unscramble jumbled anagrams against the clock to train fast pattern recognition!',
    icon: <Shuffle className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
    tag: 'Brain Puzzle',
  },
  {
    id: 'accuracy',
    title: 'Sudden Death Accuracy',
    description: 'High-stakes surgical precision: one single mistake triggers immediate game over!',
    icon: <AlertOctagon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    tag: 'Precision Training',
  },
  {
    id: 'keyhunter',
    title: 'Key Hunter Reflexes',
    description: 'Single-letter reaction tester. Perfect for beginners learning finger-to-key muscle memory!',
    icon: <Crosshair className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
    tag: 'Beginner Reflexes',
  },
];

export const GamesHubView: React.FC = () => {
  const store = useAppStore();
  const isLight = store.settings.theme === 'light';
  const activeGame = store.activeGameId;

  if (activeGame === 'race') {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => store.setActiveGame(null)}
          className={`self-start flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Games Arcade
        </button>
        <TypingRaceGame />
      </div>
    );
  }

  if (activeGame) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => store.setActiveGame(null)}
          className={`self-start flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Games Arcade
        </button>
        <ArcadeGames activeGameId={activeGame} />
      </div>
    );
  }

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
                ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
            }`}
          >
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Typing Arcade Arena</h2>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Transform typing practice into thrilling gameplay. Earn XP, coins, and climb game leaderboards!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Coins Available:
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold text-sm border border-amber-500/30">
            {store.profile.coins} 🪙
          </span>
        </div>
      </div>

      {/* Games Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAMES.map(game => {
          const highscore = store.gameScores[game.id] || 0;
          return (
            <div
              key={game.id}
              className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between gap-4 transition-all hover:scale-[1.01] ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-cyan-300 shadow-xs text-slate-800'
                  : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/60 shadow-xl text-white'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    {game.icon}
                  </div>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                      isLight
                        ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {game.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold">{game.title}</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {game.description}
                  </p>
                </div>
              </div>

              <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                <div className={`text-xs font-mono flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>High Score: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{highscore}</strong></span>
                </div>

                <button
                  onClick={() => store.setActiveGame(game.id)}
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Play
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
