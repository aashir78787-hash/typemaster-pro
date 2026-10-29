/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  color: string;
  tag: string;
}

const GAMES: GameCardDef[] = [
  {
    id: 'race',
    title: 'Typing Race Grand Prix',
    description: 'Flagship top-down race. Compete against tuned AI bots or create a multiplayer room!',
    icon: <Flag className="w-6 h-6 text-cyan-400" />,
    color: 'border-cyan-500/40 hover:border-cyan-400',
    tag: 'Flagship Multiplayer',
  },
  {
    id: 'wordrain',
    title: 'Falling Words (Word Rain)',
    description: 'Words drop from the clouds. Type and eliminate them before they hit the ground!',
    icon: <CloudRain className="w-6 h-6 text-blue-400" />,
    color: 'border-blue-500/40 hover:border-blue-400',
    tag: 'Arcade Classic',
  },
  {
    id: 'balloon',
    title: 'Balloon Pop',
    description: 'Floating colorful balloons. Type fast to pop them before they float out of the sky!',
    icon: <Compass className="w-6 h-6 text-amber-400" />,
    color: 'border-amber-500/40 hover:border-amber-400',
    tag: 'Casual Speed',
  },
  {
    id: 'zombie',
    title: 'Zombie Defense',
    description: 'Undead walkers march toward your gate. Type words to fire blasters and defeat the boss wave!',
    icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
    color: 'border-rose-500/40 hover:border-rose-400',
    tag: 'Survival Action',
  },
  {
    id: 'scramble',
    title: 'Word Scramble / Speed Spell',
    description: 'Unscramble jumbled anagrams against the clock to train fast pattern recognition!',
    icon: <Shuffle className="w-6 h-6 text-purple-400" />,
    color: 'border-purple-500/40 hover:border-purple-400',
    tag: 'Brain Puzzle',
  },
  {
    id: 'accuracy',
    title: 'Sudden Death Accuracy',
    description: 'High-stakes surgical precision: one single mistake triggers immediate game over!',
    icon: <AlertOctagon className="w-6 h-6 text-emerald-400" />,
    color: 'border-emerald-500/40 hover:border-emerald-400',
    tag: 'Precision Training',
  },
  {
    id: 'keyhunter',
    title: 'Key Hunter Reflexes',
    description: 'Single-letter reaction tester. Perfect for beginners learning finger-to-key muscle memory!',
    icon: <Crosshair className="w-6 h-6 text-teal-400" />,
    color: 'border-teal-500/40 hover:border-teal-400',
    tag: 'Beginner Reflexes',
  },
];

export const GamesHubView: React.FC = () => {
  const store = useAppStore();
  const activeGame = store.activeGameId;

  if (activeGame === 'race') {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => store.setActiveGame(null)}
          className="self-start flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
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
          className="self-start flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
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
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Typing Arcade Arena</h2>
            <p className="text-xs text-slate-400">
              Transform typing practice into thrilling gameplay. Earn XP, coins, and climb game leaderboards!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Coins Available:</span>
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-sm border border-amber-500/30">
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
              className={`p-6 rounded-2xl bg-slate-900/80 border ${game.color} shadow-xl flex flex-col justify-between gap-4 transition-all hover:scale-[1.01]`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {game.icon}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {game.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{game.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{game.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>High Score: <strong className="text-white">{highscore}</strong></span>
                </div>

                <button
                  onClick={() => store.setActiveGame(game.id)}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
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
