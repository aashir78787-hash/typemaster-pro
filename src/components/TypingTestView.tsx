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
import { Timer, RotateCcw, Award, Share2, FileText, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TypingTestView: React.FC = () => {
  const store = useAppStore();
  const isLight = store.settings.theme === 'light';

  const [duration, setDuration] = useState<number>(60);
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
  const currentTextObj = availableTexts[0] || PRACTICE_TEXTS[0];

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
      <div
        className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border transition-colors ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm text-slate-800'
            : 'bg-slate-900/80 border-slate-800 shadow-xl backdrop-blur-sm text-white'
        }`}
      >
        {/* Time Selector */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          <span
            className={`text-[10px] uppercase font-mono px-2 flex items-center gap-1 ${
              isLight ? 'text-slate-600 font-semibold' : 'text-slate-400'
            }`}
          >
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
                  ? isLight
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-cyan-500 text-slate-950 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border overflow-x-auto ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}
        >
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
                  ? isLight
                    ? 'bg-white text-cyan-800 shadow-xs border border-slate-200 font-bold'
                    : 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
          <button
            onClick={() => setCustomTextOpen(true)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
              isLight
                ? 'text-slate-600 hover:text-cyan-800'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
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
                    ? isLight
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                      : 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : isLight
                    ? 'text-slate-500 hover:text-slate-800'
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
        <div
          className={`p-3.5 rounded-xl border text-center transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className={`text-[10px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Timer Left
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
            {timeLeft}s
          </div>
        </div>
        <div
          className={`p-3.5 rounded-xl border text-center transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className={`text-[10px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Live Net WPM
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
            {engine.netWpm}
          </div>
        </div>
        <div
          className={`p-3.5 rounded-xl border text-center transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className={`text-[10px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Accuracy
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
            {engine.accuracy}%
          </div>
        </div>
        <div
          className={`p-3.5 rounded-xl border text-center transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className={`text-[10px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Errors
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>
            {engine.errorCount}
          </div>
        </div>
      </div>

      {/* Main Typing Stage or Result Screen */}
      {!testResult ? (
        <div className="flex flex-col gap-5">
          <div
            onClick={() => window.focus()}
            className={`p-6 md:p-10 rounded-2xl border min-h-[220px] flex flex-col justify-center cursor-text relative overflow-hidden transition-colors ${
              isLight
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-slate-900/90 border-slate-800 shadow-2xl'
            }`}
          >
            {/* Progress Bar Top */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
              <div
                className="h-full bg-cyan-500 transition-all duration-150"
                style={{
                  width: `${Math.min(100, (engine.currentIndex / activeTextContent.length) * 100)}%`,
                }}
              />
            </div>

            <div
              className={`text-xs font-mono mb-3 flex items-center justify-between ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <span className="font-semibold">{activeTitle}</span>
              <button
                onClick={handleRestart}
                className="hover:text-cyan-600 flex items-center gap-1 transition-colors"
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
                  charClass = isLight
                    ? 'text-slate-900 bg-cyan-100 rounded-xs ring-2 ring-cyan-500 animate-pulse font-bold'
                    : 'text-white bg-cyan-500/30 rounded-xs ring-1 ring-cyan-400 animate-pulse';
                } else if (isTyped) {
                  charClass = isCorrect
                    ? isLight
                      ? 'text-emerald-700 font-semibold'
                      : 'text-emerald-400 font-semibold'
                    : isLight
                    ? 'text-rose-700 bg-rose-100 underline decoration-rose-500'
                    : 'text-rose-400 bg-rose-500/20 underline decoration-rose-400';
                } else {
                  charClass = isLight ? 'text-slate-400' : 'text-slate-600';
                }

                return (
                  <span key={index} className={charClass}>
                    {char}
                  </span>
                );
              })}
            </div>

            {engine.status === 'idle' && (
              <div
                className={`text-xs text-center mt-6 animate-pulse font-medium ${
                  isLight ? 'text-slate-500' : 'text-slate-500'
                }`}
              >
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
        <div
          className={`p-8 rounded-2xl border shadow-xl flex flex-col gap-6 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-slate-900 border-slate-800 text-white'
          }`}
        >
          <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-5 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div>
              <div className={`text-xs font-mono uppercase font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                Test Completed
              </div>
              <h2 className={`text-3xl font-extrabold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Typing Test Summary
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {activeTitle} · {duration}s session
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShareResult}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                {copiedShare ? 'Copied!' : 'Share Result'}
              </button>
              <button
                onClick={() => setCertificateOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Award className="w-4 h-4" /> Get Certificate
              </button>
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" /> Take Another Test
              </button>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`p-5 rounded-xl border text-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className={`text-xs font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Net Speed
              </div>
              <div className={`text-4xl font-extrabold font-mono mt-1 tabular-nums ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                {testResult.netWpm}
              </div>
              <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                Words Per Minute
              </div>
            </div>

            <div
              className={`p-5 rounded-xl border text-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className={`text-xs font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Accuracy
              </div>
              <div className={`text-4xl font-extrabold font-mono mt-1 tabular-nums ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                {testResult.accuracy}%
              </div>
              <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                {testResult.errors} Errors made
              </div>
            </div>

            <div
              className={`p-5 rounded-xl border text-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className={`text-xs font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Gross Speed
              </div>
              <div className={`text-4xl font-extrabold font-mono mt-1 tabular-nums ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}>
                {testResult.grossWpm}
              </div>
              <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                Gross WPM
              </div>
            </div>

            <div
              className={`p-5 rounded-xl border text-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className={`text-xs font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Characters / Min
              </div>
              <div className={`text-4xl font-extrabold font-mono mt-1 tabular-nums ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                {testResult.cpm}
              </div>
              <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                {testResult.totalChars} Total keystrokes
              </div>
            </div>
          </div>

          {/* Weak Keys Heatmap Alert */}
          {testResult.weakKeys && testResult.weakKeys.length > 0 && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                isLight
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-rose-950/30 border-rose-800/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className={`w-5 h-5 shrink-0 ${isLight ? 'text-rose-600' : 'text-rose-400'}`} />
                <div>
                  <div className="text-xs font-bold">Weak Keys Detected in this test</div>
                  <div className="text-xs opacity-90">
                    You had frequent errors on keys:{' '}
                    <span className="font-mono font-bold uppercase underline">
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
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold whitespace-nowrap transition-colors"
              >
                Practice Targeted Drill
              </button>
            </div>
          )}
        </div>
      )}

      {/* Custom Text Modal */}
      {customTextOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl flex flex-col gap-4 ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <h3 className="text-lg font-bold">Paste Custom Practice Text</h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Paste any article, book excerpt, or code you want to practice touch-typing.
            </p>
            <textarea
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="Paste your text here..."
              rows={6}
              className={`w-full p-3 rounded-xl border text-sm font-mono focus:outline-none focus:border-cyan-500 resize-none ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCustomTextOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomText}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500"
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
