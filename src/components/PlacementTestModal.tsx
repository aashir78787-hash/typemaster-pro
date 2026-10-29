/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useTypingEngine, TypingSessionResult } from '../hooks/useTypingEngine';
import { Award, CheckCircle, RotateCcw, X, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const PLACEMENT_TEXT = 'learning to type properly is a lifelong superpower that transforms thought into clean words instantly without looking down at your hands';

export const PlacementTestModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const store = useAppStore();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col p-6 gap-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Skill Placement Test (30 Seconds)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-400">
              Type the prompt below as fast and accurately as possible. We will evaluate your current speed and automatically recommend your optimal starting lesson!
            </p>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span>Time Left: <span className="text-amber-400 font-bold">{Math.max(0, 30 - engine.elapsedTime)}s</span></span>
              <span>Speed: <span className="text-cyan-400 font-bold">{engine.netWpm} WPM</span></span>
              <span>Acc: <span className="text-emerald-400 font-bold">{engine.accuracy}%</span></span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono leading-relaxed select-none">
              {PLACEMENT_TEXT.split('').map((char, i) => {
                const isTyped = i < engine.typedChars.length;
                const isCurrent = i === engine.currentIndex;
                const isCorrect = isTyped && engine.typedChars[i] === char;

                let cls = 'text-slate-600';
                if (isCurrent) cls = 'text-white bg-cyan-500/30 ring-1 ring-cyan-400 animate-pulse';
                else if (isTyped) cls = isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 bg-rose-500/20';

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
              <Award className="w-12 h-12 text-amber-400" />
              <h4 className="text-xl font-black text-white">Assessment Complete!</h4>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Your Velocity</div>
                <div className="text-3xl font-extrabold text-cyan-400">{result.netWpm} WPM</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Your Accuracy</div>
                <div className="text-3xl font-extrabold text-emerald-400">{result.accuracy}%</div>
              </div>
            </div>

            {rec && (
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-left flex flex-col gap-1.5">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Recommended Curriculum</span>
                <div className="text-sm font-bold text-white">{rec.title}</div>
                <p className="text-xs text-slate-300">{rec.description}</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setResult(null);
                  engine.reset();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Retake
              </button>
              <button
                onClick={handleApplyRecommendation}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/25"
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
