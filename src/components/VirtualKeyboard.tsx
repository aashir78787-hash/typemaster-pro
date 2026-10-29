/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getFingerForKey } from '../utils/typingMath';
import { useAppStore } from '../store/useAppStore';

interface VirtualKeyboardProps {
  targetChar?: string;
  lastCharTyped?: string;
  isError?: boolean;
  showHands?: boolean;
}

interface KeyDef {
  key: string;
  display?: string;
  shiftDisplay?: string;
  width?: string;
  finger: string;
}

const KEYBOARD_ROWS: KeyDef[][] = [
  // Row 1
  [
    { key: '`', shiftDisplay: '~', finger: 'left-pinky' },
    { key: '1', shiftDisplay: '!', finger: 'left-pinky' },
    { key: '2', shiftDisplay: '@', finger: 'left-ring' },
    { key: '3', shiftDisplay: '#', finger: 'left-middle' },
    { key: '4', shiftDisplay: '$', finger: 'left-index' },
    { key: '5', shiftDisplay: '%', finger: 'left-index' },
    { key: '6', shiftDisplay: '^', finger: 'right-index' },
    { key: '7', shiftDisplay: '&', finger: 'right-index' },
    { key: '8', shiftDisplay: '*', finger: 'right-middle' },
    { key: '9', shiftDisplay: '(', finger: 'right-ring' },
    { key: '0', shiftDisplay: ')', finger: 'right-pinky' },
    { key: '-', shiftDisplay: '_', finger: 'right-pinky' },
    { key: '=', shiftDisplay: '+', finger: 'right-pinky' },
    { key: 'Backspace', display: '⌫', width: 'w-16', finger: 'right-pinky' },
  ],
  // Row 2
  [
    { key: 'Tab', display: 'Tab', width: 'w-14', finger: 'left-pinky' },
    { key: 'q', finger: 'left-pinky' },
    { key: 'w', finger: 'left-ring' },
    { key: 'e', finger: 'left-middle' },
    { key: 'r', finger: 'left-index' },
    { key: 't', finger: 'left-index' },
    { key: 'y', finger: 'right-index' },
    { key: 'u', finger: 'right-index' },
    { key: 'i', finger: 'right-middle' },
    { key: 'o', finger: 'right-ring' },
    { key: 'p', finger: 'right-pinky' },
    { key: '[', shiftDisplay: '{', finger: 'right-pinky' },
    { key: ']', shiftDisplay: '}', finger: 'right-pinky' },
    { key: '\\', shiftDisplay: '|', width: 'w-12', finger: 'right-pinky' },
  ],
  // Row 3
  [
    { key: 'CapsLock', display: 'Caps', width: 'w-16', finger: 'left-pinky' },
    { key: 'a', finger: 'left-pinky' },
    { key: 's', finger: 'left-ring' },
    { key: 'd', finger: 'left-middle' },
    { key: 'f', finger: 'left-index' }, // Bump
    { key: 'g', finger: 'left-index' },
    { key: 'h', finger: 'right-index' },
    { key: 'j', finger: 'right-index' }, // Bump
    { key: 'k', finger: 'right-middle' },
    { key: 'l', finger: 'right-ring' },
    { key: ';', shiftDisplay: ':', finger: 'right-pinky' },
    { key: "'", shiftDisplay: '"', finger: 'right-pinky' },
    { key: 'Enter', display: 'Enter ↵', width: 'w-20', finger: 'right-pinky' },
  ],
  // Row 4
  [
    { key: 'ShiftLeft', display: 'Shift ⇧', width: 'w-20', finger: 'left-pinky' },
    { key: 'z', finger: 'left-pinky' },
    { key: 'x', finger: 'left-ring' },
    { key: 'c', finger: 'left-middle' },
    { key: 'v', finger: 'left-index' },
    { key: 'b', finger: 'left-index' },
    { key: 'n', finger: 'right-index' },
    { key: 'm', finger: 'right-index' },
    { key: ',', shiftDisplay: '<', finger: 'right-middle' },
    { key: '.', shiftDisplay: '>', finger: 'right-ring' },
    { key: '/', shiftDisplay: '?', finger: 'right-pinky' },
    { key: 'ShiftRight', display: 'Shift ⇧', width: 'w-24', finger: 'right-pinky' },
  ],
  // Row 5
  [
    { key: 'CtrlLeft', display: 'Ctrl', width: 'w-14', finger: 'left-pinky' },
    { key: 'AltLeft', display: 'Alt', width: 'w-12', finger: 'thumb' },
    { key: ' ', display: 'Space', width: 'flex-1 max-w-sm', finger: 'thumb' },
    { key: 'AltRight', display: 'Alt', width: 'w-12', finger: 'thumb' },
    { key: 'CtrlRight', display: 'Ctrl', width: 'w-14', finger: 'right-pinky' },
  ],
];

// Light Theme Styles
const FINGER_STYLES_LIGHT: Record<string, { bg: string; border: string; text: string }> = {
  'left-pinky': { bg: 'bg-purple-50/90', border: 'border-purple-200', text: 'text-purple-900' },
  'left-ring': { bg: 'bg-indigo-50/90', border: 'border-indigo-200', text: 'text-indigo-900' },
  'left-middle': { bg: 'bg-blue-50/90', border: 'border-blue-200', text: 'text-blue-900' },
  'left-index': { bg: 'bg-emerald-50/90', border: 'border-emerald-200', text: 'text-emerald-900' },
  'thumb': { bg: 'bg-teal-50/90', border: 'border-teal-200', text: 'text-teal-900' },
  'right-index': { bg: 'bg-amber-50/90', border: 'border-amber-200', text: 'text-amber-900' },
  'right-middle': { bg: 'bg-orange-50/90', border: 'border-orange-200', text: 'text-orange-900' },
  'right-ring': { bg: 'bg-rose-50/90', border: 'border-rose-200', text: 'text-rose-900' },
  'right-pinky': { bg: 'bg-pink-50/90', border: 'border-pink-200', text: 'text-pink-900' },
};

// Dark Theme Styles
const FINGER_STYLES_DARK: Record<string, { bg: string; border: string; text: string }> = {
  'left-pinky': { bg: 'bg-purple-950/40', border: 'border-purple-600/40', text: 'text-purple-300' },
  'left-ring': { bg: 'bg-indigo-950/40', border: 'border-indigo-600/40', text: 'text-indigo-300' },
  'left-middle': { bg: 'bg-blue-950/40', border: 'border-blue-600/40', text: 'text-blue-300' },
  'left-index': { bg: 'bg-emerald-950/40', border: 'border-emerald-600/40', text: 'text-emerald-300' },
  'thumb': { bg: 'bg-teal-950/40', border: 'border-teal-600/40', text: 'text-teal-300' },
  'right-index': { bg: 'bg-amber-950/40', border: 'border-amber-600/40', text: 'text-amber-300' },
  'right-middle': { bg: 'bg-orange-950/40', border: 'border-orange-600/40', text: 'text-orange-300' },
  'right-ring': { bg: 'bg-rose-950/40', border: 'border-rose-600/40', text: 'text-rose-300' },
  'right-pinky': { bg: 'bg-pink-950/40', border: 'border-pink-600/40', text: 'text-pink-300' },
};

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  targetChar,
  lastCharTyped,
  isError,
  showHands = true,
}) => {
  const store = useAppStore();
  const isLight = store.settings.theme === 'light';
  const fingerStyles = isLight ? FINGER_STYLES_LIGHT : FINGER_STYLES_DARK;

  const activeChar = targetChar || '';
  const activeFingerAssignment = activeChar ? getFingerForKey(activeChar) : null;
  const isShiftRequired = /[A-Z!@#$%^&*()_+{}|:"<>?]/.test(activeChar);

  const isKeyActive = (keyDef: KeyDef) => {
    if (!activeChar) return false;
    if (activeChar === ' ' && keyDef.key === ' ') return true;
    if (keyDef.key.toLowerCase() === activeChar.toLowerCase()) return true;
    if (keyDef.shiftDisplay && keyDef.shiftDisplay === activeChar) return true;
    if (isShiftRequired) {
      const hand = activeFingerAssignment?.hand;
      if (hand === 'left' && keyDef.key === 'ShiftRight') return true;
      if (hand === 'right' && keyDef.key === 'ShiftLeft') return true;
    }
    return false;
  };

  const isLastTyped = (keyDef: KeyDef) => {
    if (!lastCharTyped) return false;
    if (lastCharTyped === ' ' && keyDef.key === ' ') return true;
    return keyDef.key.toLowerCase() === lastCharTyped.toLowerCase();
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 select-none">
      {/* Keyboard Enclosure */}
      <div
        className={`w-full max-w-4xl p-3 md:p-4 rounded-2xl transition-all duration-200 border ${
          isLight
            ? 'bg-slate-100/90 border-slate-200 shadow-xl'
            : 'bg-slate-900/90 border-slate-800 shadow-2xl backdrop-blur-md'
        }`}
      >
        <div className="flex flex-col gap-1.5 md:gap-2">
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-1 md:gap-1.5 w-full">
              {row.map((k) => {
                const active = isKeyActive(k);
                const pressed = isLastTyped(k);
                const fingerStyle = fingerStyles[k.finger] || fingerStyles['thumb'];
                const isHomeBump = k.key === 'f' || k.key === 'j';

                let keyClasses = `relative flex flex-col items-center justify-center rounded-lg border text-xs md:text-sm font-mono font-medium transition-all duration-150 h-10 md:h-12 shadow-sm ${k.width || 'w-8 md:w-11'} `;

                if (active) {
                  keyClasses += isLight
                    ? 'bg-cyan-600 border-cyan-500 text-white font-bold ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(8,145,178,0.5)] scale-[1.04] z-10 '
                    : 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold ring-2 ring-white/70 shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-[1.04] z-10 ';
                } else if (pressed) {
                  keyClasses += isError
                    ? 'bg-rose-500 border-rose-400 text-white shadow-md scale-95 '
                    : 'bg-emerald-500 border-emerald-400 text-white shadow-md scale-95 ';
                } else {
                  keyClasses += `${fingerStyle.bg} ${fingerStyle.border} ${fingerStyle.text} hover:brightness-105 active:scale-95 `;
                }

                return (
                  <div key={k.key} className={keyClasses}>
                    {k.shiftDisplay && (
                      <span className="text-[10px] opacity-60 leading-none mb-0.5">
                        {k.shiftDisplay}
                      </span>
                    )}
                    <span className="leading-none">
                      {k.display || k.key.toUpperCase()}
                    </span>

                    {/* Raised tactile bump for home keys F and J */}
                    {isHomeBump && (
                      <span
                        className={`absolute bottom-1 w-2.5 h-0.5 rounded-full ${
                          isLight ? 'bg-slate-500 opacity-80' : 'bg-current opacity-70'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Hand & Finger Visual Guide */}
      {showHands && activeFingerAssignment && (
        <div
          className={`flex flex-wrap items-center justify-center gap-6 px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
            isLight
              ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Target Key:</span>
            <span
              className={`px-2.5 py-0.5 font-mono font-bold rounded border ${
                isLight
                  ? 'bg-slate-100 text-slate-900 border-slate-300 shadow-xs'
                  : 'bg-slate-800 text-white border-slate-700'
              }`}
            >
              {activeChar === ' ' ? 'Space' : activeChar}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Recommended Finger:</span>
            <span
              className={`px-2.5 py-0.5 rounded font-semibold border ${
                isLight
                  ? 'bg-cyan-50 text-cyan-900 border-cyan-200'
                  : activeFingerAssignment.colorClass
              }`}
            >
              {activeFingerAssignment.fingerName} ({activeFingerAssignment.hand.toUpperCase()} HAND)
            </span>
          </div>

          {isShiftRequired && (
            <div className={`flex items-center gap-1.5 ${isLight ? 'text-amber-700 font-semibold' : 'text-amber-300'}`}>
              <span>⇧ Hold {activeFingerAssignment.hand === 'left' ? 'Right' : 'Left'} Shift</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
