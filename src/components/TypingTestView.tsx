/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PRACTICE_TEXTS, PracticeText, TextCategory, TextDifficulty } from '../data/texts';
import { useAppStore } from '../store/useAppStore';
import { useTypingEngine, TypingSessionResult } from '../hooks/useTypingEngine';
import { VirtualKeyboard } from './VirtualKeyboard';
import { CertificateModal } from './CertificateModal';
import { Timer, RotateCcw, Award, Share2, FileText, Check, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TypingTestView: React.FC = () => {
  const store = useAppStore();
  const [duration, setDuration] = useState<number>(60); // 60s standard
  const [category, setCategory] = useState<TextCategory>('words');
  const [difficulty, setDifficulty] = useState<TextDifficulty>('easy');
  const [customTextOpen, setCustomTextOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Filter texts
  const availableTexts = PRACTICE_TEXTS.filter(
    t => t.category === category && (category === 'code' || category === 'numbers' ? true : t.difficulty === difficulty)
  );
  const [selectedTextIndex, setSelectedTextIndex] = useState(0);
  const currentTextObj = availableTexts[selectedTextIndex] || PRACTICE_TEXTS[0];

  const [activeTextContent, setActiveTextContent] = useState<string>(currentTextObj.content);
  const [activeTitle, setActiveTitle] = useState<string>(currentTextObj.title);

  const [testResult, setTestResult] = useState<TypingSessionResult | null>(null);

  const handleTestComplete = (res: TypingSessionResult) => {
    store.recordTestResult({
      wpm: res.netWpm,
      grossWpm: res.grossWpm,
      accuracy: res.accuracy,
      cpm: res.cpm,
      timeSec: res.timeElapsed,
      mode: `${duration}s ${category}`,
      textTitle: activeTitle,
      errors: res.errors,
      weakKeysInTest: res.weakKeys,
    });
    setTestResult(res);

    if (res.netWpm >= 50) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleKeyStroke = (char: string, isError: boolean, latencyMs: number) => {
    store.recordKeyHit(char, isError, latencyMs);
  };

  const engine = useTypingEngine({
    text: activeTextContent,
    durationSeconds: duration > 0 ? duration : undefined,
    stopOnError: store.settings.stopOnError,
    onComplete: handleTestComplete,
    onKeyStroke: handleKeyStroke,
  });

  const handleSelectText = (textObj: PracticeText) => {
    setActiveTextContent(textObj.content);
    setActiveTitle(textObj.title);
    setTestResult(null);
    engine.reset();
  };

  const handleApplyCustomText = () => {
    if (!customInput.trim()) return;
    setActiveTextContent(customInput.trim());
    setActiveTitle('Custom User Text');
    setCustomTextOpen(false);
    setTestResult(null);
    engine.reset();
  };

  const handleRestart = () => {
    setTestResult(null);
    engine.reset();
  };

  const handleShareResult = () => {
    if (!testResult) return;
    const text = `🏆 TypeMaster Pro Test: ${testResult.netWpm} WPM | ${testResult.accuracy}% Accuracy | ${testResult.timeElapsed}s test on TypeMaster Pro!`;
    navigator.clipboard?.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const timeLeft = Math.max(0, duration - engine.elapsedTime);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Test Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        {/* Time Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 px-2 flex items-center gap-1">
            <Timer className="w-3.5 h-3.5" /> Time:
          </span>
          {[
            { sec: 30, label: '30s' },
            { sec: 60, label: '1 min' },
            { sec: 120, label: '2 min' },
            { sec: 300, label: '5 min' },
          ].map(t => (
            <button
              key={t.sec}
              onClick={() => {
                setDuration(t.sec);
                handleRestart();
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                duration === t.sec
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {[
            { id: 'words', label: 'Words' },
            { id: 'quotes', label: 'Quotes' },
            { id: 'paragraphs', label: 'Prose' },
            { id: 'code', label: 'Code' },
            { id: 'numbers', label: 'Numbers' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => {
                setCategory(c.id as TextCategory);
                const firstMatch = PRACTICE_TEXTS.find(t => t.category === c.id);
                if (firstMatch) handleSelectText(firstMatch);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                category === c.id
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
          <button
            onClick={() => setCustomTextOpen(true)}
            className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-cyan-300 rounded-lg transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" /> Custom
          </button>
        </div>

        {/* Difficulty Selector */}
        {category !== 'code' && category !== 'numbers' && (
          <div className="flex items-center gap-1 text-xs">
            {(['easy', 'medium', 'hard'] as TextDifficulty[]).map(d => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  const firstMatch = PRACTICE_TEXTS.find(t => t.category === category && t.difficulty === d);
                  if (firstMatch) handleSelectText(firstMatch);
                }}
                className={`px-2.5 py-1 capitalize rounded-lg text-xs font-medium transition-colors ${
                  difficulty === d
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Live Stats Ribbon */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Timer Left</div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{timeLeft}s</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Live Net WPM</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">{engine.netWpm}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Accuracy</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{engine.accuracy}%</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Errors</div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">{engine.errorCount}</div>
        </div>
      </div>

      {/* Main Typing Stage or Result Screen */}
      {!testResult ? (
        <div className="flex flex-col gap-5">
          <div
            onClick={() => window.focus()}
            className="p-6 md:p-10 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl min-h-[220px] flex flex-col justify-center cursor-text relative overflow-hidden"
          >
            {/* Progress Bar Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
              <div
                className="h-full bg-cyan-400 transition-all duration-150"
                style={{
                  width: `${Math.min(100, (engine.currentIndex / activeTextContent.length) * 100)}%`,
                }}
              />
            </div>

            <div className="text-xs font-mono text-slate-500 mb-3 flex items-center justify-between">
              <span>{activeTitle}</span>
              <button
                onClick={handleRestart}
                className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restart
              </button>
            </div>

            <div
              className={`leading-relaxed tracking-wider break-words select-none font-mono ${
                store.settings.fontSize === 'sm'
                  ? 'text-lg'
                  : store.settings.fontSize === 'lg'
                  ? 'text-2xl'
                  : store.settings.fontSize === 'xl'
                  ? 'text-3xl'
                  : 'text-xl'
              }`}
            >
              {activeTextContent.split('').map((char, index) => {
                const isTyped = index < engine.typedChars.length;
                const isCurrent = index === engine.currentIndex;
                const isCorrect = isTyped && engine.typedChars[index] === char;

                let charClass = '';
                if (isCurrent) {
                  charClass = 'text-white bg-cyan-500/30 rounded-sm ring-1 ring-cyan-400 animate-pulse';
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
                Click inside and start typing to start the test.
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
      ) : (
        /* Test Results Screen */
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">Test Completed</div>
              <h2 className="text-3xl font-extrabold text-white mt-0.5">Typing Test Summary</h2>
              <p className="text-xs text-slate-400">{activeTitle} · {duration}s session</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShareResult}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                {copiedShare ? 'Copied to Clipboard!' : 'Share Result'}
              </button>
              <button
                onClick={() => setCertificateOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Award className="w-4 h-4" /> Get Certificate
              </button>
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
              >
                <RotateCcw className="w-4 h-4" /> Take Another Test
              </button>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-xs font-mono text-slate-400 uppercase">Net Speed</div>
              <div className="text-4xl font-extrabold font-mono text-cyan-400 mt-1 tabular-nums">
                {testResult.netWpm}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Words Per Minute</div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-xs font-mono text-slate-400 uppercase">Accuracy</div>
              <div className="text-4xl font-extrabold font-mono text-emerald-400 mt-1 tabular-nums">
                {testResult.accuracy}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{testResult.errors} Errors made</div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-xs font-mono text-slate-400 uppercase">Gross Speed</div>
              <div className="text-4xl font-extrabold font-mono text-indigo-400 mt-1 tabular-nums">
                {testResult.grossWpm}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Gross WPM</div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-xs font-mono text-slate-400 uppercase">Characters / Min</div>
              <div className="text-4xl font-extrabold font-mono text-amber-400 mt-1 tabular-nums">
                {testResult.cpm}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{testResult.totalChars} Total keystrokes</div>
            </div>
          </div>

          {/* Weak Keys Heatmap Alert */}
          {testResult.weakKeys && testResult.weakKeys.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-rose-200">Weak Keys Detected in this test</div>
                  <div className="text-xs text-rose-300/80">
                    You had frequent errors on keys:{' '}
                    <span className="font-mono font-bold text-white uppercase">
                      {testResult.weakKeys.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  store.setActiveLesson(1);
                  store.setTab('lessons');
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold whitespace-nowrap transition-colors"
              >
                Practice Targeted Drill
              </button>
            </div>
          )}
        </div>
      )}

      {/* Custom Text Modal */}
      {customTextOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white">Paste Custom Practice Text</h3>
            <p className="text-xs text-slate-400">
              Paste any article, book excerpt, or code you want to practice touch-typing.
            </p>
            <textarea
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="Paste your text here..."
              rows={6}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCustomTextOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomText}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400"
              >
                Start Typing Custom Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {certificateOpen && testResult && (
        <CertificateModal
          userName={store.profile.username}
          wpm={testResult.netWpm}
          accuracy={testResult.accuracy}
          date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          onClose={() => setCertificateOpen(false)}
        />
      )}
    </div>
  );
};
