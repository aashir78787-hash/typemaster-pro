/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundManager } from '../../utils/soundEngine';
import { Trophy, Flag, Play, RotateCcw, Zap, ShoppingCart, Users, Bot, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Racer {
  id: string;
  name: string;
  isPlayer: boolean;
  targetWpm: number;
  currentWordIndex: number;
  color: string;
  carEmoji: string;
  finishTime: number | null;
  wpm: number;
}

const RACE_CARS = [
  { id: 'classic-red', name: 'Classic Red Racer', emoji: '🏎️', price: 0, color: 'bg-red-500' },
  { id: 'cyber-truck', name: 'Cyber Titanium', emoji: '🚙', price: 300, color: 'bg-cyan-500' },
  { id: 'neon-phantom', name: 'Neon Phantom', emoji: '🚀', price: 600, color: 'bg-purple-500' },
  { id: 'formula-gold', name: 'Formula Apex Gold', emoji: '🥇', price: 1000, color: 'bg-amber-500' },
];

const BOT_PRESETS = [
  { difficulty: 'easy', name: 'Slow Bob', wpm: 32, emoji: '🚗', color: 'bg-blue-500' },
  { difficulty: 'medium', name: 'Swift Sarah', wpm: 56, emoji: '🚕', color: 'bg-amber-500' },
  { difficulty: 'fast', name: 'Nitro Neo', wpm: 84, emoji: '🏎️', color: 'bg-purple-500' },
  { difficulty: 'pro', name: 'Cyber Beast AI', wpm: 114, emoji: '⚡', color: 'bg-rose-500' },
];

const RACE_TEXT = 'speed and accuracy are the true hallmarks of an elite typist who trains daily with unwavering dedication and razor sharp focus';

export const TypingRaceGame: React.FC = () => {
  const store = useAppStore();
  const isDark = store.settings.theme === 'dark';
  const [mode, setMode] = useState<'lobby' | 'countdown' | 'racing' | 'podium' | 'garage'>('lobby');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'fast' | 'pro'>('medium');
  const [roomCode, setRoomCode] = useState('RACE-902');
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const words = useRef<string[]>(RACE_TEXT.split(' '));
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [racers, setRacers] = useState<Racer[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);

  const currentCar = RACE_CARS.find(c => c.id === store.profile.selectedCar) || RACE_CARS[0];

  const initRacers = () => {
    const list: Racer[] = [
      {
        id: 'player',
        name: store.profile.username + ' (You)',
        isPlayer: true,
        targetWpm: 0,
        currentWordIndex: 0,
        color: 'bg-cyan-400',
        carEmoji: currentCar.emoji,
        finishTime: null,
        wpm: 0,
      },
    ];

    if (!isMultiplayer) {
      // Pick bots based on difficulty
      const chosenBot = BOT_PRESETS.find(b => b.difficulty === selectedDifficulty) || BOT_PRESETS[1];
      list.push({
        id: 'bot1',
        name: chosenBot.name,
        isPlayer: false,
        targetWpm: chosenBot.wpm,
        currentWordIndex: 0,
        color: chosenBot.color,
        carEmoji: chosenBot.emoji,
        finishTime: null,
        wpm: chosenBot.wpm,
      });

      // Add a secondary challenger bot
      const secondBot = BOT_PRESETS[(BOT_PRESETS.indexOf(chosenBot) + 1) % BOT_PRESETS.length];
      list.push({
        id: 'bot2',
        name: secondBot.name,
        isPlayer: false,
        targetWpm: Math.round(secondBot.wpm * 0.9),
        currentWordIndex: 0,
        color: secondBot.color,
        carEmoji: secondBot.emoji,
        finishTime: null,
        wpm: Math.round(secondBot.wpm * 0.9),
      });
    } else {
      // Simulated multiplayer room opponents
      list.push(
        { id: 'p2', name: 'Alex_Speed', isPlayer: false, targetWpm: 65, currentWordIndex: 0, color: 'bg-emerald-400', carEmoji: '🏎️', finishTime: null, wpm: 65 },
        { id: 'p3', name: 'TypingValkyrie', isPlayer: false, targetWpm: 78, currentWordIndex: 0, color: 'bg-purple-400', carEmoji: '🚀', finishTime: null, wpm: 78 }
      );
    }

    setRacers(list);
  };

  const startRaceSequence = () => {
    initRacers();
    setCurrentWordIdx(0);
    setCurrentInput('');
    setMode('countdown');
    setCountdown(3);
    soundManager.playCountdown(false);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        soundManager.playCountdown(false);
      } else if (count === 0) {
        setCountdown(0);
        soundManager.playCountdown(true);
      } else {
        clearInterval(interval);
        setMode('racing');
        setStartTime(performance.now());
      }
    }, 1000);
  };

  // Bot simulation loop
  useEffect(() => {
    if (mode !== 'racing' || !startTime) return;

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsedSec = (now - startTime) / 1000;

      setRacers(prevRacers => {
        let allFinished = true;
        const updated = prevRacers.map(racer => {
          if (racer.isPlayer) {
            if (racer.currentWordIndex < words.current.length) allFinished = false;
            return racer;
          }

          // Bot progress calculation based on targetWpm
          // targetWpm words per minute -> words per second
          const wordsPerSec = racer.targetWpm / 60;
          const targetWord = Math.min(words.current.length, Math.floor(elapsedSec * wordsPerSec));

          let finish = racer.finishTime;
          if (targetWord >= words.current.length && !finish) {
            finish = Math.round(elapsedSec * 10) / 10;
          }

          if (!finish) allFinished = false;

          return {
            ...racer,
            currentWordIndex: targetWord,
            finishTime: finish,
          };
        });

        if (allFinished) {
          clearInterval(interval);
          setMode('podium');
          soundManager.playLevelUp();
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        }

        return updated;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [mode, startTime]);

  // Handle player typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mode !== 'racing') return;

    const val = e.target.value;
    const targetWord = words.current[currentWordIdx];

    // If space pressed or user finished word
    if (val.endsWith(' ') || val === targetWord) {
      const cleanVal = val.trim();
      if (cleanVal === targetWord) {
        soundManager.playKeyClick();
        const nextWordIdx = currentWordIdx + 1;
        setCurrentWordIdx(nextWordIdx);
        setCurrentInput('');

        // Update player position
        const now = performance.now();
        const elapsedSec = startTime ? (now - startTime) / 1000 : 1;
        const playerWpm = Math.round((nextWordIdx / (elapsedSec / 60)));

        setRacers(prev =>
          prev.map(r => {
            if (!r.isPlayer) return r;
            const isDone = nextWordIdx >= words.current.length;
            if (isDone) {
              soundManager.playLevelUp();
              confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
              store.recordGameScore('race', playerWpm);
              store.addXpAndCoins(200, 60);
            }
            return {
              ...r,
              currentWordIndex: nextWordIdx,
              wpm: playerWpm,
              finishTime: isDone ? Math.round(elapsedSec * 10) / 10 : null,
            };
          })
        );

        if (nextWordIdx >= words.current.length) {
          setMode('podium');
        }
      } else {
        soundManager.playError();
        setCurrentInput(val);
      }
    } else {
      soundManager.playKeyClick();
      setCurrentInput(val);
    }
  };

  const getRankings = () => {
    return [...racers].sort((a, b) => {
      if (a.finishTime && b.finishTime) return a.finishTime - b.finishTime;
      if (a.finishTime) return -1;
      if (b.finishTime) return 1;
      return b.currentWordIndex - a.currentWordIndex;
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Race Header Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400' : 'bg-cyan-50 border border-cyan-200 text-cyan-600'
          }`}>
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              TypeMaster Grand Prix 🏎️
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Type fast to accelerate your racer across the finish line!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-mono font-bold">
            Coins: {store.profile.coins} 🪙
          </div>
          <button
            onClick={() => setMode(mode === 'garage' ? 'lobby' : 'garage')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-amber-500" />
            {mode === 'garage' ? 'Back to Race' : 'Car Shop'}
          </button>
        </div>
      </div>

      {/* Mode View: Garage / Car Shop */}
      {mode === 'garage' && (
        <div className={`p-6 rounded-2xl border flex flex-col gap-5 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Racer Garage & Skins</h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Unlock custom vehicle sprites using your earned coins.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {RACE_CARS.map(car => {
              const isUnlocked = store.profile.unlockedCars.includes(car.id);
              const isSelected = store.profile.selectedCar === car.id;
              return (
                <div
                  key={car.id}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-3 text-center transition-all ${
                    isSelected
                      ? isDark
                        ? 'bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/30'
                        : 'bg-cyan-50/70 border-cyan-500 ring-2 ring-cyan-500/30'
                      : isDark
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-5xl my-2">{car.emoji}</div>
                  <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{car.name}</div>
                  {isUnlocked ? (
                    <button
                      disabled={isSelected}
                      onClick={() => store.updateProfile({ selectedCar: car.id })}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isSelected
                          ? isDark
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : isDark
                            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                            : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      }`}
                    >
                      {isSelected ? 'Equipped' : 'Select'}
                    </button>
                  ) : (
                    <button
                      onClick={() => store.buyCar(car.id, car.price)}
                      disabled={store.profile.coins < car.price}
                      className="w-full py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Buy for {car.price} 🪙
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode View: Lobby */}
      {mode === 'lobby' && (
        <div className={`p-8 rounded-2xl border flex flex-col items-center text-center gap-6 max-w-xl mx-auto shadow-lg ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-4xl ${
            isDark ? 'bg-cyan-500/20 border-cyan-500/40' : 'bg-cyan-50 border-cyan-200'
          }`}>
            {currentCar.emoji}
          </div>

          <div>
            <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Choose Your Race Arena</h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Race solo against tuned AI bots or create a multiplayer room!</p>
          </div>

          {/* Mode Switcher */}
          <div className={`flex items-center gap-2 p-1 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setIsMultiplayer(false)}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                !isMultiplayer
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-4 h-4" /> Solo vs AI Bots
            </button>
            <button
              onClick={() => setIsMultiplayer(true)}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                isMultiplayer
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" /> Multiplayer Room
            </button>
          </div>

          {!isMultiplayer ? (
            <div className="flex flex-col gap-2 w-full">
              <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>AI Bot Difficulty:</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {BOT_PRESETS.map(b => (
                  <button
                    key={b.difficulty}
                    onClick={() => setSelectedDifficulty(b.difficulty as 'easy' | 'medium' | 'fast' | 'pro')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedDifficulty === b.difficulty
                        ? isDark
                          ? 'bg-slate-800 border-cyan-500 text-cyan-400 font-bold'
                          : 'bg-cyan-50 border-cyan-500 text-cyan-700 font-bold'
                        : isDark
                          ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xs">{b.name}</div>
                    <div className="text-[10px] opacity-70 font-mono mt-0.5">{b.wpm} WPM</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`w-full p-3 rounded-xl border text-xs flex flex-col gap-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Room Code:</span>
              <span className="text-base font-mono font-bold text-amber-500">{roomCode}</span>
              <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>2 Players in lobby ready</span>
            </div>
          )}

          <button
            onClick={startRaceSequence}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-transform hover:scale-[1.02]"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Race!
          </button>
        </div>
      )}

      {/* Countdown Overlay */}
      {mode === 'countdown' && (
        <div className={`p-16 rounded-2xl border text-center flex flex-col items-center justify-center gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="text-xs uppercase font-mono tracking-widest text-cyan-500 font-bold">Get Ready</div>
          <div className={`text-7xl font-black font-mono animate-bounce ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {countdown > 0 ? countdown : 'GO!'}
          </div>
        </div>
      )}

      {/* Racing & Track Canvas */}
      {(mode === 'racing' || mode === 'podium') && (
        <div className="flex flex-col gap-6">
          {/* Race Track */}
          <div className={`p-4 md:p-6 rounded-2xl border shadow-lg flex flex-col gap-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between text-xs font-mono border-b pb-2 ${
              isDark ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-200'
            }`}>
              <span>START 🏁</span>
              <span>TRACK LENGTH: {words.current.length} WORDS</span>
              <span>FINISH 🏁</span>
            </div>

            {/* Racers Lanes */}
            <div className="flex flex-col gap-3">
              {racers.map(racer => {
                const progressPct = Math.min(
                  100,
                  (racer.currentWordIndex / words.current.length) * 100
                );
                return (
                  <div key={racer.id} className="flex flex-col gap-1">
                    <div className={`flex justify-between text-xs font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      <span className="flex items-center gap-1.5">
                        <span className="text-base">{racer.carEmoji}</span>
                        {racer.name}
                      </span>
                      <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                        {racer.finishTime ? `${racer.finishTime}s (Done)` : `${Math.round(progressPct)}%`}
                      </span>
                    </div>

                    <div className={`relative h-10 rounded-xl border overflow-hidden flex items-center px-1 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {/* Checkered Finish Strip */}
                      <div className="absolute right-0 top-0 bottom-0 w-4 bg-[repeating-linear-gradient(45deg,#000,#000_4px,#fff_4px,#fff_8px)] opacity-30" />

                      {/* Moving Car */}
                      <div
                        className="absolute transition-all duration-200 flex items-center gap-1"
                        style={{ left: `calc(${progressPct * 0.9}% + 4px)` }}
                      >
                        <span className="text-2xl filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.6)]">
                          {racer.carEmoji}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Player Typing Deck */}
          {mode === 'racing' && (
            <div className={`p-6 rounded-2xl border flex flex-col gap-4 shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Word to type:</div>
              {/* Words stream */}
              <div className={`flex flex-wrap gap-2 text-lg md:text-xl font-mono leading-relaxed p-4 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                {words.current.map((w, idx) => {
                  let cls = isDark ? 'text-slate-500' : 'text-slate-400';
                  if (idx < currentWordIdx) cls = 'text-emerald-600 dark:text-emerald-400 font-semibold';
                  else if (idx === currentWordIdx) cls = isDark ? 'text-white font-bold bg-cyan-500/30 px-2 rounded ring-1 ring-cyan-400' : 'text-cyan-900 font-bold bg-cyan-100 px-2 rounded ring-1 ring-cyan-400';
                  return <span key={idx} className={cls}>{w}</span>;
                })}
              </div>

              {/* Input Box */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  autoFocus
                  value={currentInput}
                  onChange={handleInputChange}
                  placeholder="Type the highlighted word and press Space..."
                  className={`flex-1 p-3.5 rounded-xl border font-mono text-lg focus:outline-none focus:border-cyan-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Podium / Results */}
          {mode === 'podium' && (
            <div className={`p-8 rounded-2xl border text-center flex flex-col items-center gap-5 shadow-lg ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <Trophy className="w-12 h-12 text-amber-500 animate-bounce" />
              <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Race Completed!</h3>

              <div className="w-full max-w-md flex flex-col gap-2">
                {getRankings().map((r, rankIdx) => (
                  <div
                    key={r.id}
                    className={`p-3 rounded-xl border flex items-center justify-between font-mono text-sm ${
                      r.isPlayer
                        ? isDark
                          ? 'bg-cyan-950/60 border-cyan-500 font-bold text-white'
                          : 'bg-cyan-50 border-cyan-400 font-bold text-cyan-900'
                        : isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-center font-bold text-amber-500">#{rankIdx + 1}</span>
                      <span>{r.carEmoji} {r.name}</span>
                    </div>
                    <span>{r.finishTime ? `${r.finishTime}s` : 'DNF'}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setMode('lobby')}
                  className={`py-2.5 px-5 rounded-xl text-xs font-semibold transition-colors border ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  Race Lobby
                </button>
                <button
                  onClick={startRaceSequence}
                  className="py-2.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold transition-colors shadow-md shadow-cyan-500/20"
                >
                  Rematch!
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
