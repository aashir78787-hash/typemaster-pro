/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getFingerForKey } from '../utils/typingMath';

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

const FINGER_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'left-pinky': { bg: 'bg-purple-950/40', border: 'border-purple-600/40', text: 'text-purple-300', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)] bg-purple-600/40 border-purple-400' },
  'left-ring': { bg: 'bg-indigo-950/40', border: 'border-indigo-600/40', text: 'text-indigo-300', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.5)] bg-indigo-600/40 border-indigo-400' },
  'left-middle': { bg: 'bg-blue-950/40', border: 'border-blue-600/40', text: 'text-blue-300', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)] bg-blue-600/40 border-blue-400' },
  'left-index': { bg: 'bg-emerald-950/40', border: 'border-emerald-600/40', text: 'text-emerald-300', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)] bg-emerald-600/40 border-emerald-400' },
  'thumb': { bg: 'bg-teal-950/40', border: 'border-teal-600/40', text: 'text-teal-300', glow: 'shadow-[0_0_15px_rgba(20,184,166,0.5)] bg-teal-600/40 border-teal-400' },
  'right-index': { bg: 'bg-amber-950/40', border: 'border-amber-600/40', text: 'text-amber-300', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)] bg-amber-600/40 border-amber-400' },
  'right-middle': { bg: 'bg-orange-950/40', border: 'border-orange-600/40', text: 'text-orange-300', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)] bg-orange-600/40 border-orange-400' },
  'right-ring': { bg: 'bg-rose-950/40', border: 'border-rose-600/40', text: 'text-rose-300', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)] bg-rose-600/40 border-rose-400' },
  'right-pinky': { bg: 'bg-pink-950/40', border: 'border-pink-600/40', text: 'text-pink-300', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.5)] bg-pink-600/40 border-pink-400' },
};

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  targetChar,
  lastCharTyped,
  isError,
  showHands = true,
}) => {
  const activeChar = targetChar || '';
  const activeFingerAssignment = activeChar ? getFingerForKey(activeChar) : null;
  const isShiftRequired = /[A-Z!@#$%^&*()_+{}|:"<>?]/.test(activeChar);

  // Check if a specific key is the active target
  const isKeyActive = (keyDef: KeyDef) => {
    if (!activeChar) return false;
    if (activeChar === ' ' && keyDef.key === ' ') return true;
    if (keyDef.key.toLowerCase() === activeChar.toLowerCase()) return true;
    if (keyDef.shiftDisplay && keyDef.shiftDisplay === activeChar) return true;
    if (isShiftRequired) {
      // If target character is capital on the right, ShiftLeft is active; vice versa
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
      <div className="w-full max-w-4xl p-3 md:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-1.5 md:gap-2">
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-1 md:gap-1.5 w-full">
              {row.map((k) => {
                const active = isKeyActive(k);
                const pressed = isLastTyped(k);
                const fingerColor = FINGER_COLORS[k.finger] || FINGER_COLORS['thumb'];
                const isHomeBump = k.key === 'f' || k.key === 'j';

                let keyClasses = `relative flex flex-col items-center justify-center rounded-lg border text-xs md:text-sm font-mono font-medium transition-all duration-150 h-10 md:h-12 shadow-sm ${k.width || 'w-8 md:w-11'} `;

                if (active) {
                  keyClasses += `${fingerColor.glow} scale-[1.04] z-10 text-white font-bold ring-2 ring-white/70 `;
                } else if (pressed) {
                  keyClasses += isError
                    ? 'bg-red-500/80 border-red-400 text-white shadow-[0_0_12px_rgba(239,68,68,0.8)] scale-95 '
                    : 'bg-emerald-500/80 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.8)] scale-95 ';
                } else {
                  keyClasses += `${fingerColor.bg} ${fingerColor.border} ${fingerColor.text} hover:brightness-125 `;
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
                      <span className="absolute bottom-1 w-2.5 h-0.5 bg-current rounded-full opacity-70" />
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
        <div className="flex flex-wrap items-center justify-center gap-6 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Target Key:</span>
            <span className="px-2 py-0.5 font-mono font-bold rounded bg-slate-800 text-white border border-slate-700">
              {activeChar === ' ' ? 'Space' : activeChar}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Use:</span>
            <span className={`px-2 py-0.5 rounded font-semibold border ${activeFingerAssignment.colorClass}`}>
              {activeFingerAssignment.fingerName} ({activeFingerAssignment.hand.toUpperCase()} HAND)
            </span>
          </div>

          {isShiftRequired && (
            <div className="flex items-center gap-1.5 text-amber-300">
              <span>⇧ Hold {activeFingerAssignment.hand === 'left' ? 'Right' : 'Left'} Shift</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
