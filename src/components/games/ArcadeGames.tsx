/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundManager } from '../../utils/soundEngine';
import {
  CloudRain,
  Compass,
  ShieldAlert,
  Shuffle,
  AlertOctagon,
  Crosshair,
  Play,
  RotateCcw,
  Trophy,
  Heart,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const WORD_BANK = [
  'swift', 'type', 'react', 'speed', 'laser', 'focus', 'flow', 'storm',
  'cyber', 'spark', 'matrix', 'master', 'rhythm', 'dynamo', 'turbo', 'stride',
  'finger', 'keypad', 'zenith', 'vector', 'blaster', 'shadow', 'glitch', 'syntax',
  'orbit', 'plasma', 'quantum', 'cipher', 'nexus', 'vortex', 'rocket', 'shield'
];

interface FallingWord {
  id: number;
  word: string;
  x: number; // percentage 10% - 85%
  y: number; // percentage 0% - 100%
  speed: number;
}

interface Zombie {
  id: number;
  word: string;
  dist: number; // 100 down to 0
  maxDist: number;
  isBoss: boolean;
}

interface Balloon {
  id: number;
  word: string;
  x: number;
  y: number; // starts at 100, floats to 0
  color: string;
}

export const ArcadeGames: React.FC<{ activeGameId: string }> = ({ activeGameId }) => {
  const store = useAppStore();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentInput, setCurrentInput] = useState('');
  const [level, setLevel] = useState(1);

  // Falling Words state
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);

  // Balloon Pop state
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  // Zombie Defense state
  const [zombies, setZombies] = useState<Zombie[]>([]);
  const [wave, setWave] = useState(1);

  // Word Scramble state
  const [scrambleTarget, setScrambleTarget] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [scrambleStreak, setScrambleStreak] = useState(0);

  // Accuracy Challenge state
  const [accuracyTarget, setAccuracyTarget] = useState('');
  const [accuracyStreak, setAccuracyStreak] = useState(0);

  // Key Hunter state
  const [hunterTargetKey, setHunterTargetKey] = useState('A');
  const [hunterScore, setHunterScore] = useState(0);
  const [hunterTimeLeft, setHunterTimeLeft] = useState(30);

  const highScore = store.gameScores[activeGameId] || 0;

  // Start chosen game
  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setCurrentInput('');
    setGameState('playing');

    if (activeGameId === 'wordrain') {
      setFallingWords([
        { id: 1, word: WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)], x: 20, y: 0, speed: 0.6 },
        { id: 2, word: WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)], x: 60, y: -20, speed: 0.8 },
      ]);
    } else if (activeGameId === 'balloon') {
      const colors = ['bg-rose-500', 'bg-cyan-500', 'bg-amber-500', 'bg-emerald-500', 'bg-purple-500'];
      setBalloons([
        { id: 1, word: WORD_BANK[0], x: 25, y: 95, color: colors[0] },
        { id: 2, word: WORD_BANK[1], x: 65, y: 110, color: colors[1] },
      ]);
    } else if (activeGameId === 'zombie') {
      setWave(1);
      setZombies([
        { id: 1, word: 'zombie', dist: 100, maxDist: 100, isBoss: false },
        { id: 2, word: 'ghoul', dist: 120, maxDist: 120, isBoss: false },
      ]);
    } else if (activeGameId === 'scramble') {
      nextScramble();
    } else if (activeGameId === 'accuracy') {
      nextAccuracyWord();
    } else if (activeGameId === 'keyhunter') {
      setHunterScore(0);
      setHunterTimeLeft(30);
      nextHunterKey();
    }
  };

  const nextScramble = () => {
    const raw = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    const jumbled = raw.split('').sort(() => 0.5 - Math.random()).join('');
    setScrambleTarget(raw);
    setScrambledWord(jumbled === raw ? raw.split('').reverse().join('') : jumbled);
    setCurrentInput('');
  };

  const nextAccuracyWord = () => {
    const word = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    setAccuracyTarget(word);
    setCurrentInput('');
  };

  const nextHunterKey = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
    setHunterTargetKey(randomChar);
  };

  const triggerGameOver = (finalScore: number) => {
    setGameState('gameover');
    soundManager.playError();
    store.recordGameScore(activeGameId, finalScore);
  };

  // 1. Falling Words Loop
  useEffect(() => {
    if (activeGameId !== 'wordrain' || gameState !== 'playing') return;

    const interval = setInterval(() => {
      setFallingWords(prev => {
        const next: FallingWord[] = [];
        let lostLife = false;

        prev.forEach(item => {
          const nextY = item.y + item.speed * 0.9;
          if (nextY >= 100) {
            lostLife = true;
          } else {
            next.push({ ...item, y: nextY });
          }
        });

        if (lostLife) {
          soundManager.playError();
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) triggerGameOver(score);
            return nextL;
          });
        }

        // Spawn new word if needed
        if (next.length < 3 + Math.floor(score / 500)) {
          next.push({
            id: Date.now() + Math.random(),
            word: WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)],
            x: Math.floor(Math.random() * 70) + 10,
            y: -10,
            speed: 0.5 + Math.random() * 0.5 + score * 0.0005,
          });
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeGameId, gameState, score]);

  // 2. Balloon Pop Loop
  useEffect(() => {
    if (activeGameId !== 'balloon' || gameState !== 'playing') return;

    const interval = setInterval(() => {
      setBalloons(prev => {
        const next: Balloon[] = [];
        let lost = false;

        prev.forEach(b => {
          const nextY = b.y - 0.7;
          if (nextY <= 0) {
            lost = true;
          } else {
            next.push({ ...b, y: nextY });
          }
        });

        if (lost) {
          soundManager.playError();
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) triggerGameOver(score);
            return nextL;
          });
        }

        const colors = ['bg-rose-500', 'bg-cyan-500', 'bg-amber-500', 'bg-emerald-500', 'bg-purple-500'];
        if (next.length < 3) {
          next.push({
            id: Date.now() + Math.random(),
            word: WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)],
            x: Math.floor(Math.random() * 70) + 15,
            y: 105,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeGameId, gameState, score]);

  // 3. Zombie Defense Loop
  useEffect(() => {
    if (activeGameId !== 'zombie' || gameState !== 'playing') return;

    const interval = setInterval(() => {
      setZombies(prev => {
        let breached = false;
        const updated = prev.map(z => {
          const nextDist = z.dist - (z.isBoss ? 0.3 : 0.6);
          if (nextDist <= 5) breached = true;
          return { ...z, dist: nextDist };
        });

        if (breached) {
          soundManager.playError();
          triggerGameOver(score);
          return [];
        }

        if (updated.length === 0) {
          // Next wave
          setWave(w => w + 1);
          soundManager.playLevelUp();
          const isBossWave = (wave + 1) % 3 === 0;
          return [
            { id: Date.now(), word: isBossWave ? 'abomination' : WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)], dist: 100, maxDist: 100, isBoss: isBossWave },
            { id: Date.now() + 1, word: WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)], dist: 130, maxDist: 130, isBoss: false },
          ];
        }

        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeGameId, gameState, score, wave]);

  // 4. Key Hunter Timer
  useEffect(() => {
    if (activeGameId !== 'keyhunter' || gameState !== 'playing') return;

    const timer = setInterval(() => {
      setHunterTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          triggerGameOver(hunterScore);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeGameId, gameState, hunterScore]);

  // Keypress listener for Key Hunter
  useEffect(() => {
    if (activeGameId !== 'keyhunter' || gameState !== 'playing') return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === hunterTargetKey) {
        soundManager.playPop();
        setHunterScore(s => s + 1);
        nextHunterKey();
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        soundManager.playError();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeGameId, gameState, hunterTargetKey]);

  // Typing Input Handler for Word Rain, Balloon Pop, Zombie Defense, Scramble, Accuracy
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const clean = val.trim().toLowerCase();

    if (activeGameId === 'wordrain') {
      soundManager.playKeyClick();
      setCurrentInput(val);
      const match = fallingWords.find(fw => fw.word.toLowerCase() === clean);
      if (match) {
        soundManager.playLaser();
        setFallingWords(prev => prev.filter(w => w.id !== match.id));
        setScore(s => s + 100);
        setCurrentInput('');
      }
    } else if (activeGameId === 'balloon') {
      soundManager.playKeyClick();
      setCurrentInput(val);
      const match = balloons.find(b => b.word.toLowerCase() === clean);
      if (match) {
        soundManager.playPop();
        setBalloons(prev => prev.filter(b => b.id !== match.id));
        setScore(s => s + 100);
        setCurrentInput('');
      }
    } else if (activeGameId === 'zombie') {
      soundManager.playKeyClick();
      setCurrentInput(val);
      const match = zombies.find(z => z.word.toLowerCase() === clean);
      if (match) {
        soundManager.playLaser();
        setZombies(prev => prev.filter(z => z.id !== match.id));
        setScore(s => s + (match.isBoss ? 300 : 150));
        setCurrentInput('');
      }
    } else if (activeGameId === 'scramble') {
      soundManager.playKeyClick();
      setCurrentInput(val);
      if (clean === scrambleTarget.toLowerCase()) {
        soundManager.playCombo();
        setScore(s => s + 150);
        setScrambleStreak(st => st + 1);
        nextScramble();
      }
    } else if (activeGameId === 'accuracy') {
      soundManager.playKeyClick();
      // If mistake made: sudden death!
      if (!accuracyTarget.toLowerCase().startsWith(clean)) {
        soundManager.playError();
        triggerGameOver(accuracyStreak);
        return;
      }
      setCurrentInput(val);
      if (clean === accuracyTarget.toLowerCase()) {
        soundManager.playCombo();
        setScore(s => s + 100);
        setAccuracyStreak(st => st + 1);
        nextAccuracyWord();
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Game Stage Enclosure */}
      <div className="w-full p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative min-h-[460px] flex flex-col">
        {/* Top Game Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="font-bold text-white text-lg capitalize flex items-center gap-2">
              {activeGameId === 'wordrain' && <CloudRain className="w-5 h-5 text-cyan-400" />}
              {activeGameId === 'balloon' && <Compass className="w-5 h-5 text-amber-400" />}
              {activeGameId === 'zombie' && <ShieldAlert className="w-5 h-5 text-rose-400" />}
              {activeGameId === 'scramble' && <Shuffle className="w-5 h-5 text-indigo-400" />}
              {activeGameId === 'accuracy' && <AlertOctagon className="w-5 h-5 text-emerald-400" />}
              {activeGameId === 'keyhunter' && <Crosshair className="w-5 h-5 text-purple-400" />}
              {activeGameId} Arcade
            </div>
            <div className="text-xs text-slate-400 font-mono">
              High Score: <span className="text-amber-400 font-bold">{highScore}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {gameState === 'playing' && (
              <>
                {activeGameId !== 'keyhunter' && activeGameId !== 'accuracy' && (
                  <div className="flex items-center gap-1 text-rose-400">
                    {[...Array(lives)].map((_, i) => (
                      <Heart key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                )}
                {activeGameId === 'keyhunter' && (
                  <div className="text-sm font-mono font-bold text-amber-400">
                    Time: {hunterTimeLeft}s
                  </div>
                )}
                <div className="text-sm font-mono font-bold text-cyan-400">
                  Score: {score}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Menu Screen */}
        {gameState === 'menu' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 my-auto">
            <h3 className="text-3xl font-extrabold text-white">
              Ready to Play {activeGameId.toUpperCase()}?
            </h3>
            <p className="text-xs md:text-sm text-slate-400 max-w-md">
              {activeGameId === 'wordrain' && 'Words rain from the sky. Type them quickly before they crash!'}
              {activeGameId === 'balloon' && 'Balloons float upwards. Type words to pop them before they escape!'}
              {activeGameId === 'zombie' && 'Zombies march toward your defense gate. Type words to shoot them down!'}
              {activeGameId === 'scramble' && 'Unscramble the jumbled word anagram as fast as you can!'}
              {activeGameId === 'accuracy' && 'Sudden Death: One mistake ends the game. How many can you type?'}
              {activeGameId === 'keyhunter' && 'Hit the requested key instantly with the correct finger!'}
            </p>
            <button
              onClick={startGame}
              className="py-3 px-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              Play Game
            </button>
          </div>
        )}

        {/* Active Gameplay View */}
        {gameState === 'playing' && (
          <div className="flex-1 flex flex-col justify-between relative overflow-hidden">
            {/* 1. Word Rain Surface */}
            {activeGameId === 'wordrain' && (
              <div className="relative w-full h-[320px] bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden">
                {fallingWords.map(fw => (
                  <div
                    key={fw.id}
                    className="absolute px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 font-mono text-sm font-bold shadow-md shadow-cyan-500/20 transition-all duration-100"
                    style={{ left: `${fw.x}%`, top: `${fw.y}%` }}
                  >
                    {fw.word}
                  </div>
                ))}
              </div>
            )}

            {/* 2. Balloon Pop Surface */}
            {activeGameId === 'balloon' && (
              <div className="relative w-full h-[320px] bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden">
                {balloons.map(b => (
                  <div
                    key={b.id}
                    className={`absolute px-4 py-2 rounded-full ${b.color} text-white font-mono text-xs font-bold shadow-lg transition-all duration-100`}
                    style={{ left: `${b.x}%`, top: `${b.y}%` }}
                  >
                    🎈 {b.word}
                  </div>
                ))}
              </div>
            )}

            {/* 3. Zombie Defense Surface */}
            {activeGameId === 'zombie' && (
              <div className="relative w-full h-[320px] bg-slate-950/60 rounded-xl border border-slate-800 p-4 flex flex-col justify-center">
                <div className="w-full flex justify-between text-xs font-mono text-slate-500 mb-2">
                  <span>DEFENSE BASE 🛡️</span>
                  <span>WAVE {wave}</span>
                  <span>ZOMBIE HORDE 🧟</span>
                </div>
                <div className="relative h-20 bg-slate-900 rounded-xl border border-slate-800 flex items-center px-4">
                  {zombies.map(z => (
                    <div
                      key={z.id}
                      className="absolute flex flex-col items-center gap-1 transition-all duration-100"
                      style={{ left: `${z.dist}%` }}
                    >
                      <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500 text-rose-300 text-xs font-mono font-bold">
                        {z.word}
                      </span>
                      <span className="text-2xl">{z.isBoss ? '👹' : '🧟'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Word Scramble Surface */}
            {activeGameId === 'scramble' && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <div className="text-xs uppercase font-mono text-slate-400">Unscramble This Word:</div>
                <div className="text-4xl md:text-5xl font-black font-mono tracking-widest text-amber-400 bg-slate-950 px-6 py-3 rounded-2xl border border-slate-800">
                  {scrambledWord.toUpperCase()}
                </div>
                <div className="text-xs text-slate-400 font-mono">Streak: {scrambleStreak}</div>
              </div>
            )}

            {/* 5. Accuracy Sudden Death Surface */}
            {activeGameId === 'accuracy' && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <div className="text-xs uppercase font-mono text-rose-400 font-bold">
                  SUDDEN DEATH: 1 MISTAKE = GAME OVER
                </div>
                <div className="text-4xl font-extrabold font-mono text-white bg-slate-950 px-8 py-3 rounded-2xl border border-slate-800">
                  {accuracyTarget}
                </div>
                <div className="text-xs text-slate-400 font-mono">Words survived: {accuracyStreak}</div>
              </div>
            )}

            {/* 6. Key Hunter Surface */}
            {activeGameId === 'keyhunter' && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <div className="text-xs uppercase font-mono text-purple-400 font-bold">
                  TAP THE KEY IMMEDIATELY
                </div>
                <div className="w-28 h-28 rounded-2xl bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center text-6xl font-black font-mono text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-pulse">
                  {hunterTargetKey}
                </div>
                <div className="text-xs text-slate-400 font-mono">Keys hit: {hunterScore}</div>
              </div>
            )}

            {/* Bottom Input Box for applicable games */}
            {activeGameId !== 'keyhunter' && (
              <div className="mt-4">
                <input
                  type="text"
                  autoFocus
                  value={currentInput}
                  onChange={handleInputChange}
                  placeholder="Type word here..."
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-lg text-white focus:outline-none focus:border-cyan-400 shadow-inner"
                />
              </div>
            )}
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 my-auto">
            <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
            <h3 className="text-3xl font-extrabold text-white">Game Over!</h3>
            <div className="text-sm text-slate-400">
              Your Final Score:{' '}
              <span className="font-mono font-bold text-2xl text-cyan-400">
                {activeGameId === 'keyhunter' ? hunterScore : score}
              </span>
            </div>
            <button
              onClick={startGame}
              className="py-2.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
