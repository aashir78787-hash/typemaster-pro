/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useTypingEngine, TypingSessionResult } from '../hooks/useTypingEngine';
import { Award, X, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const PLACEMENT_TEXT = 'learning to type properly is a lifelong superpower that transforms thought into clean words instantly without looking down at your hands';

export const PlacementTestModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const store = useAppStore();
  const isLight = store.settings.theme === 'light';
  const [result, setResult] = useState<TypingSessionResult | null>(null);

  const handleComplete = (res: TypingSessionResult) => {
    setResult(res);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    store.recordTestResult({
      wpm: res.netWpm,
      grossWpm: res.grossWpm,
      accuracy: res.accuracy,
      cpm: res.cpm,
      timeSec: res.timeElapsed,
      mode: 'Placement Test',
      textTitle: 'Initial Placement',
      errors: res.errors,
    });
  };

  const engine = useTypingEngine({
    text: PLACEMENT_TEXT,
    durationSeconds: 30,
    onComplete: handleComplete,
  });

  const getRecommendation = (wpm: number) => {
    if (wpm >= 45) {
      return {
        level: 4,
        lessonId: 25,
        title: 'Level 4: Numbers, Symbols & Advanced Sprints',
        description: 'You already possess great keyboard dexterity! Jump straight into symbols and speed mastery.',
      };
    }
    if (wpm >= 25) {
      return {
        level: 2,
        lessonId: 9,
        title: 'Level 2: Top Row Mastery',
        description: 'Solid typing foundation. Focus on top and bottom row reach coordination.',
      };
    }
    return {
      level: 1,
      lessonId: 1,
      title: 'Level 1: Home Row Fundamentals',
      description: 'Perfect starting ground. Learn the proper 10-finger placement starting with anchor keys F and J.',
    };
  };

  const rec = result ? getRecommendation(result.netWpm) : null;

  const handleApplyRecommendation = () => {
    if (rec) {
      store.setActiveLesson(rec.lessonId);
      store.setTab('lessons');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div
        className={`w-full max-w-lg border rounded-2xl shadow-2xl flex flex-col p-6 gap-5 transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-lg font-bold">Skill Placement Test (30 Seconds)</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          <div className="flex flex-col gap-4">
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Type the prompt below as fast and accurately as possible. We will evaluate your current speed and automatically recommend your optimal starting lesson!
            </p>

            <div
              className={`flex items-center justify-between text-xs font-mono p-2.5 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/80 border-slate-800 text-slate-400'
              }`}
            >
              <span>Time Left: <span className="text-amber-600 font-bold">{Math.max(0, 30 - engine.elapsedTime)}s</span></span>
              <span>Speed: <span className="text-cyan-700 dark:text-cyan-400 font-bold">{engine.netWpm} WPM</span></span>
              <span>Acc: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{engine.accuracy}%</span></span>
            </div>

            <div
              className={`p-4 rounded-xl border text-sm font-mono leading-relaxed select-none ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}
            >
              {PLACEMENT_TEXT.split('').map((char, i) => {
                const isTyped = i < engine.typedChars.length;
                const isCurrent = i === engine.currentIndex;
                const isCorrect = isTyped && engine.typedChars[i] === char;

                let cls = '';
                if (isCurrent) {
                  cls = isLight
                    ? 'text-slate-900 bg-cyan-100 ring-2 ring-cyan-500 font-bold rounded-xs animate-pulse'
                    : 'text-white bg-cyan-500/30 ring-1 ring-cyan-400 animate-pulse';
                } else if (isTyped) {
                  cls = isCorrect
                    ? isLight
                      ? 'text-emerald-700 font-semibold'
                      : 'text-emerald-400 font-bold'
                    : isLight
                    ? 'text-rose-700 bg-rose-100'
                    : 'text-rose-400 bg-rose-500/20';
                } else {
                  cls = isLight ? 'text-slate-400' : 'text-slate-600';
                }

                return <span key={i} className={cls}>{char}</span>;
              })}
            </div>

            {engine.status === 'idle' && (
              <div className="text-xs text-center text-slate-500 animate-pulse">
                Click inside and start typing to begin the 30s timer.
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5 text-center">
            <div className="flex flex-col items-center gap-1">
              <Award className="w-12 h-12 text-amber-500" />
              <h4 className="text-xl font-black">Assessment Complete!</h4>
            </div>

            <div
              className={`grid grid-cols-2 gap-3 p-4 rounded-xl border font-mono ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div>
                <div className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Your Velocity
                </div>
                <div className={`text-3xl font-extrabold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                  {result.netWpm} WPM
                </div>
              </div>
              <div>
                <div className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Your Accuracy
                </div>
                <div className={`text-3xl font-extrabold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  {result.accuracy}%
                </div>
              </div>
            </div>

            {rec && (
              <div
                className={`p-4 rounded-xl border text-left flex flex-col gap-1.5 ${
                  isLight
                    ? 'bg-cyan-50/80 border-cyan-200 text-slate-800'
                    : 'bg-cyan-950/40 border-cyan-800/60 text-white'
                }`}
              >
                <span className={`text-[10px] font-mono uppercase font-bold ${isLight ? 'text-cyan-800' : 'text-cyan-400'}`}>
                  Recommended Curriculum
                </span>
                <div className="text-sm font-bold">{rec.title}</div>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{rec.description}</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setResult(null);
                  engine.reset();
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
              >
                Retake
              </button>
              <button
                onClick={handleApplyRecommendation}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500 flex items-center justify-center gap-1.5 shadow-sm"
              >
                Start Curriculum <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
