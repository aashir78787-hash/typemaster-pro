/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateNetWpm, calculateGrossWpm, calculateAccuracy, calculateCpm } from '../utils/typingMath';
import { soundManager } from '../utils/soundEngine';

export interface TypingEngineConfig {
  text: string;
  durationSeconds?: number; // Optional timed mode (e.g. 60s)
  stopOnError?: boolean;
  onComplete?: (result: TypingSessionResult) => void;
  onKeyStroke?: (char: string, isError: boolean, latencyMs: number) => void;
}

export interface TypingSessionResult {
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  cpm: number;
  timeElapsed: number;
  errors: number;
  totalChars: number;
  correctChars: number;
  weakKeys: string[];
}

export function useTypingEngine({
  text,
  durationSeconds,
  stopOnError = false,
  onComplete,
  onKeyStroke,
}: TypingEngineConfig) {
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lastChar, setLastChar] = useState<string | undefined>(undefined);
  const [lastIsError, setLastIsError] = useState(false);

  // Mutable refs to prevent re-renders on keystrokes and eliminate input lag
  const textChars = useRef<string[]>(text.split(''));
  const startTime = useRef<number | null>(null);
  const lastKeyTime = useRef<number | null>(null);
  const errorMap = useRef<Record<string, number>>({});
  const timerRef = useRef<number | null>(null);
  const isCompletedRef = useRef(false);

  // Update text when target changes
  useEffect(() => {
    textChars.current = text.split('');
    setTypedChars([]);
    setStatus('idle');
    setElapsedTime(0);
    setLastChar(undefined);
    setLastIsError(false);
    errorMap.current = {};
    isCompletedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
  }, [text]);

  const currentIndex = typedChars.length;
  const targetChar = textChars.current[currentIndex] || '';

  // Calculate live statistics
  let correctCount = 0;
  let errorCount = 0;
  for (let i = 0; i < typedChars.length; i++) {
    if (typedChars[i] === textChars.current[i]) {
      correctCount++;
    } else {
      errorCount++;
    }
  }

  const effectiveTime = Math.max(1, elapsedTime);
  const netWpm = calculateNetWpm(correctCount, effectiveTime);
  const grossWpm = calculateGrossWpm(typedChars.length, effectiveTime);
  const accuracy = calculateAccuracy(correctCount, typedChars.length);
  const cpm = calculateCpm(correctCount, effectiveTime);

  // Finish session
  const finishSession = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setStatus('completed');
    if (timerRef.current) clearInterval(timerRef.current);

    const weakList = Object.entries(errorMap.current)
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => k);

    const finalResult: TypingSessionResult = {
      netWpm,
      grossWpm,
      accuracy,
      cpm,
      timeElapsed: effectiveTime,
      errors: errorCount,
      totalChars: typedChars.length,
      correctChars: correctCount,
      weakKeys: weakList,
    };

    onComplete?.(finalResult);
  }, [netWpm, grossWpm, accuracy, cpm, effectiveTime, errorCount, typedChars.length, correctCount, onComplete]);

  // Timer loop
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = window.setInterval(() => {
        setElapsedTime((prev) => {
          const next = prev + 1;
          if (durationSeconds && next >= durationSeconds) {
            finishSession();
            return durationSeconds;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, durationSeconds, finishSession]);

  // Window blur pause
  useEffect(() => {
    const handleBlur = () => {
      if (status === 'running') setStatus('paused');
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [status]);

  // Handle keydown
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore meta keys, alt, ctrl, tab, etc.
      if (e.key === 'Tab' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Meta' || e.key === 'CapsLock') {
        return;
      }

      // Allow space without scrolling page
      if (e.key === ' ') {
        e.preventDefault();
      }

      if (status === 'completed') return;

      const now = performance.now();
      const latency = lastKeyTime.current ? Math.round(now - lastKeyTime.current) : 150;
      lastKeyTime.current = now;

      // Start on first key
      if (status === 'idle') {
        setStatus('running');
        startTime.current = now;
      } else if (status === 'paused') {
        setStatus('running');
      }

      // Backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        setTypedChars((prev) => prev.slice(0, -1));
        soundManager.playKeyClick();
        return;
      }

      // Only single character keys
      if (e.key.length !== 1) return;

      const expectedChar = textChars.current[typedChars.length];
      if (!expectedChar) return;

      const isCorrect = e.key === expectedChar;

      // Stop on error mode: if wrong and stopOnError is active, don't advance until fixed
      if (!isCorrect && stopOnError) {
        soundManager.playError();
        setLastChar(e.key);
        setLastIsError(true);
        errorMap.current[expectedChar] = (errorMap.current[expectedChar] || 0) + 1;
        onKeyStroke?.(expectedChar, true, latency);
        return;
      }

      // Play sound
      if (isCorrect) {
        soundManager.playKeyClick();
        setLastIsError(false);
      } else {
        soundManager.playError();
        setLastIsError(true);
        errorMap.current[expectedChar] = (errorMap.current[expectedChar] || 0) + 1;
      }

      setLastChar(e.key);
      onKeyStroke?.(expectedChar, !isCorrect, latency);

      // Advance
      const nextTyped = [...typedChars, e.key];
      setTypedChars(nextTyped);

      // Check if text is finished
      if (nextTyped.length >= textChars.current.length) {
        // Complete!
        finishSession();
      }
    },
    [status, typedChars, stopOnError, onKeyStroke, finishSession]
  );

  // Attach keydown listener to window
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const reset = () => {
    setTypedChars([]);
    setStatus('idle');
    setElapsedTime(0);
    setLastChar(undefined);
    setLastIsError(false);
    errorMap.current = {};
    isCompletedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const pause = () => {
    if (status === 'running') setStatus('paused');
  };

  const resume = () => {
    if (status === 'paused') setStatus('running');
  };

  return {
    status,
    typedChars,
    targetChar,
    currentIndex,
    netWpm,
    grossWpm,
    accuracy,
    cpm,
    errorCount,
    elapsedTime,
    lastChar,
    lastIsError,
    reset,
    pause,
    resume,
  };
}
