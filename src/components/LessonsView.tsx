/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LESSONS, Lesson } from '../data/lessons';
import { useAppStore } from '../store/useAppStore';
import { useTypingEngine, TypingSessionResult } from '../hooks/useTypingEngine';
import { calculateStars } from '../utils/typingMath';
import { VirtualKeyboard } from './VirtualKeyboard';
import { Star, CheckCircle, ArrowRight, RotateCcw, Award, Lightbulb, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LessonsView: React.FC = () => {
  const store = useAppStore();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const activeLessonId = store.activeLessonId || 1;
  const activeLesson = LESSONS.find(l => l.id === activeLessonId) || LESSONS[0];

  const [lastResult, setLastResult] = useState<TypingSessionResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleLessonComplete = (result: TypingSessionResult) => {
    const stars = calculateStars(
      result.netWpm,
      result.accuracy,
      activeLesson.targetWpm,
      activeLesson.targetAccuracy
    );

    store.recordLessonCompletion(activeLesson.id, result.netWpm, result.accuracy, stars);
    setLastResult(result);
    setShowResultModal(true);

    if (stars > 0) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleKeyStroke = (char: string, isError: boolean, latencyMs: number) => {
    store.recordKeyHit(char, isError, latencyMs);
  };

  const engine = useTypingEngine({
    text: activeLesson.text,
    stopOnError: store.settings.stopOnError,
    onComplete: handleLessonComplete,
    onKeyStroke: handleKeyStroke,
  });

  const progress = store.lessonProgress[activeLesson.id];

  const handleNextLesson = () => {
    setShowResultModal(false);
    if (activeLesson.id < LESSONS.length) {
      const nextId = activeLesson.id + 1;
      const nextLesson = LESSONS.find(l => l.id === nextId);
      if (nextLesson) {
        setSelectedLevel(nextLesson.level);
        store.setActiveLesson(nextId);
        engine.reset();
      }
    }
  };

  const handleRetry = () => {
    setShowResultModal(false);
    engine.reset();
  };

  const isLessonUnlocked = (lessonId: number) => {
    if (lessonId === 1) return true;
    const prev = store.lessonProgress[lessonId - 1];
    return prev && prev.completed;
  };

  const levelLessons = LESSONS.filter(l => l.level === selectedLevel);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Level Selection Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {[
            { level: 1, name: 'Home Row' },
            { level: 2, name: 'Top Row' },
            { level: 3, name: 'Bottom Row' },
            { level: 4, name: 'Numbers & Symbols' },
            { level: 5, name: 'Speed & Code' },
          ].map(lvl => (
            <button
              key={lvl.level}
              onClick={() => setSelectedLevel(lvl.level)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedLevel === lvl.level
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Level {lvl.level}: {lvl.name}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 px-2 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" />
          <span>
            {Object.values(store.lessonProgress).filter(p => p.completed).length} / 40 Lessons Completed
          </span>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Lesson List */}
        <div className="lg:col-span-1 flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Level {selectedLevel} Lessons
          </div>
          {levelLessons.map(lesson => {
            const isUnlocked = isLessonUnlocked(lesson.id);
            const p = store.lessonProgress[lesson.id];
            const isCurrent = lesson.id === activeLesson.id;

            return (
              <button
                key={lesson.id}
                disabled={!isUnlocked}
                onClick={() => {
                  store.setActiveLesson(lesson.id);
                  engine.reset();
                  setShowResultModal(false);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 relative ${
                  isCurrent
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                    : isUnlocked
                    ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-slate-400">
                    Lesson {lesson.id}
                  </span>
                  {p?.completed ? (
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= (p.stars || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  ) : !isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  ) : null}
                </div>
                <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                  {lesson.title}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>Target: {lesson.targetWpm} WPM</span>
                  <span>·</span>
                  <span>{lesson.targetAccuracy}% Acc</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Main Stage: Interactive Lesson Area */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Active Lesson Header */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono text-cyan-400 font-semibold">
                  LESSON {activeLesson.id} OF 40 · LEVEL {activeLesson.level}
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {activeLesson.title}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{activeLesson.description}</p>
              </div>

              {/* Targets strip */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Target WPM</div>
                  <div className="text-sm font-bold font-mono text-cyan-400">{activeLesson.targetWpm}</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Target Acc</div>
                  <div className="text-sm font-bold font-mono text-emerald-400">{activeLesson.targetAccuracy}%</div>
                </div>
                <button
                  onClick={handleRetry}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Restart lesson"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hand guide tip banner */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
              <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{activeLesson.handGuideTip}</span>
            </div>
          </div>

          {/* Real-time Performance HUD */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Live WPM</div>
              <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">{engine.netWpm}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Accuracy</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{engine.accuracy}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Errors</div>
              <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">{engine.errorCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Time</div>
              <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{engine.elapsedTime}s</div>
            </div>
          </div>

          {/* Typing Surface */}
          <div
            onClick={() => window.focus()}
            className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner min-h-[160px] flex flex-col justify-center cursor-text relative overflow-hidden"
          >
            {/* Progress Bar Top Edge */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
              <div
                className="h-full bg-cyan-400 transition-all duration-150"
                style={{
                  width: `${Math.min(100, (engine.currentIndex / activeLesson.text.length) * 100)}%`,
                }}
              />
            </div>

            <div
              className={`leading-relaxed tracking-wider break-words select-none font-mono ${
                store.settings.fontSize === 'sm'
                  ? 'text-base'
                  : store.settings.fontSize === 'lg'
                  ? 'text-2xl'
                  : store.settings.fontSize === 'xl'
                  ? 'text-3xl'
                  : 'text-xl'
              }`}
            >
              {activeLesson.text.split('').map((char, index) => {
                const isTyped = index < engine.typedChars.length;
                const isCurrent = index === engine.currentIndex;
                const isCorrect = isTyped && engine.typedChars[index] === char;

                let charClass = '';
                if (isCurrent) {
                  charClass =
                    'text-white bg-cyan-500/30 rounded-sm ring-1 ring-cyan-400 animate-pulse';
                } else if (isTyped) {
                  charClass = isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 bg-rose-500/20 underline decoration-rose-400';
                } else {
                  charClass = 'text-slate-600';
                }

                return (
                  <span key={index} className={charClass}>
                    {char}
                  </span>
                );
              })}
            </div>

            {engine.status === 'idle' && (
              <div className="text-xs text-slate-500 text-center mt-6 animate-pulse">
                Click here and start typing anytime. Zero input lag active.
              </div>
            )}
          </div>

          {/* Virtual Keyboard */}
          {store.settings.showKeyboard && (
            <VirtualKeyboard
              targetChar={engine.targetChar}
              lastCharTyped={engine.lastChar}
              isError={engine.lastIsError}
              showHands={store.settings.showHands}
            />
          )}
        </div>
      </div>

      {/* Lesson Complete Modal */}
      {showResultModal && lastResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col gap-5 text-center">
            {/* Header / Stars */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3].map(s => {
                  const starsEarned = calculateStars(
                    lastResult.netWpm,
                    lastResult.accuracy,
                    activeLesson.targetWpm,
                    activeLesson.targetAccuracy
                  );
                  return (
                    <Star
                      key={s}
                      className={`w-8 h-8 transition-transform duration-300 ${
                        s <= starsEarned ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-700'
                      }`}
                    />
                  );
                })}
              </div>
              <h3 className="text-2xl font-bold text-white">
                {calculateStars(lastResult.netWpm, lastResult.accuracy, activeLesson.targetWpm, activeLesson.targetAccuracy) > 0
                  ? 'Lesson Passed!'
                  : 'Target Missed'}
              </h3>
              <p className="text-xs text-slate-400">
                Target: {activeLesson.targetWpm} WPM & {activeLesson.targetAccuracy}% accuracy
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 font-mono">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Your Net Speed</div>
                <div className="text-2xl font-bold text-cyan-400">{lastResult.netWpm} WPM</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Your Accuracy</div>
                <div className="text-2xl font-bold text-emerald-400">{lastResult.accuracy}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Time Elapsed</div>
                <div className="text-lg font-bold text-amber-400">{lastResult.timeElapsed}s</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Errors</div>
                <div className="text-lg font-bold text-rose-400">{lastResult.errors}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Lesson
              </button>
              <button
                onClick={handleNextLesson}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/25"
              >
                Next Lesson
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
