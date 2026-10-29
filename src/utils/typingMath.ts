/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FingerAssignment {
  finger: 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'thumb' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky';
  hand: 'left' | 'right';
  fingerName: string;
  colorClass: string;
}

/**
 * Net WPM = (Correct Characters / 5) / (Time in Minutes)
 * Standard typing definition: 1 word = 5 characters.
 */
export function calculateNetWpm(correctChars: number, timeInSeconds: number): number {
  if (timeInSeconds <= 0) return 0;
  const minutes = timeInSeconds / 60;
  const words = correctChars / 5;
  const wpm = words / minutes;
  return Math.max(0, Math.round(wpm));
}

/**
 * Gross WPM = (Total Typed Characters / 5) / (Time in Minutes)
 */
export function calculateGrossWpm(totalChars: number, timeInSeconds: number): number {
  if (timeInSeconds <= 0) return 0;
  const minutes = timeInSeconds / 60;
  const words = totalChars / 5;
  const wpm = words / minutes;
  return Math.max(0, Math.round(wpm));
}

/**
 * Accuracy percentage = (Correct Characters / Total Typed Characters) * 100
 */
export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars <= 0) return 100;
  const acc = (correctChars / totalChars) * 100;
  return Math.min(100, Math.max(0, Math.round(acc * 10) / 10));
}

/**
 * Characters Per Minute (CPM)
 */
export function calculateCpm(correctChars: number, timeInSeconds: number): number {
  if (timeInSeconds <= 0) return 0;
  const minutes = timeInSeconds / 60;
  return Math.max(0, Math.round(correctChars / minutes));
}

/**
 * Determine star rating (1 to 3 stars) based on lesson targets
 */
export function calculateStars(
  wpm: number,
  accuracy: number,
  targetWpm: number,
  targetAcc: number
): number {
  if (accuracy < targetAcc || wpm < targetWpm * 0.7) {
    return 0; // Failed
  }
  if (wpm >= targetWpm * 1.25 && accuracy >= Math.min(100, targetAcc + 2)) {
    return 3; // Outstanding
  }
  if (wpm >= targetWpm && accuracy >= targetAcc) {
    return 2; // Passed target
  }
  return 1; // Just passed minimal
}

/**
 * Map any keyboard character to correct finger & hand
 */
export function getFingerForKey(char: string): FingerAssignment {
  const c = char.toLowerCase();

  // Left Pinky
  if (['1', '!', '`', '~', 'q', 'a', 'z', 'tab', 'capslock', 'shift'].includes(c)) {
    return { finger: 'left-pinky', hand: 'left', fingerName: 'Left Pinky', colorClass: 'text-purple-400 bg-purple-500/20 border-purple-500/40' };
  }
  // Left Ring
  if (['2', '@', 'w', 's', 'x'].includes(c)) {
    return { finger: 'left-ring', hand: 'left', fingerName: 'Left Ring', colorClass: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/40' };
  }
  // Left Middle
  if (['3', '#', 'e', 'd', 'c'].includes(c)) {
    return { finger: 'left-middle', hand: 'left', fingerName: 'Left Middle', colorClass: 'text-blue-400 bg-blue-500/20 border-blue-500/40' };
  }
  // Left Index
  if (['4', '$', '5', '%', 'r', 't', 'f', 'g', 'v', 'b'].includes(c)) {
    return { finger: 'left-index', hand: 'left', fingerName: 'Left Index', colorClass: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' };
  }
  // Thumbs
  if ([' ', 'space'].includes(c)) {
    return { finger: 'thumb', hand: 'left', fingerName: 'Either Thumb', colorClass: 'text-teal-400 bg-teal-500/20 border-teal-500/40' };
  }
  // Right Index
  if (['6', '^', '7', '&', 'y', 'u', 'h', 'j', 'n', 'm'].includes(c)) {
    return { finger: 'right-index', hand: 'right', fingerName: 'Right Index', colorClass: 'text-amber-400 bg-amber-500/20 border-amber-500/40' };
  }
  // Right Middle
  if (['8', '*', 'i', 'k', ',', '<'].includes(c)) {
    return { finger: 'right-middle', hand: 'right', fingerName: 'Right Middle', colorClass: 'text-orange-400 bg-orange-500/20 border-orange-500/40' };
  }
  // Right Ring
  if (['9', '(', 'o', 'l', '.', '>'].includes(c)) {
    return { finger: 'right-ring', hand: 'right', fingerName: 'Right Ring', colorClass: 'text-rose-400 bg-rose-500/20 border-rose-500/40' };
  }
  // Right Pinky (0, P, punctuation, Enter, Backspace)
  return { finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky', colorClass: 'text-pink-400 bg-pink-500/20 border-pink-500/40' };
}

/**
 * Generate adaptive drill text focusing on identified weak keys
 */
export function generateWeakKeyDrill(weakKeys: string[], count = 25): string {
  if (!weakKeys || weakKeys.length === 0) {
    return 'the quick brown fox jumps over the lazy dog repeatedly to test typing dexterity';
  }

  const commonWords = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can',
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
    'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy',
    'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'dad', 'mom'
  ];

  const focusKeys = weakKeys.map(k => k.toLowerCase());
  
  // Find words containing the weak keys
  const targetWords = commonWords.filter(w => 
    focusKeys.some(k => w.includes(k))
  );

  const pool = targetWords.length > 5 ? targetWords : commonWords;
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    // Alternate between random weak key syllable and target word
    if (i % 2 === 0 && focusKeys.length > 0) {
      const k = focusKeys[i % focusKeys.length];
      const patterns = [`${k}${k}`, `a${k}e`, `${k}in`, `${k}er`, `un${k}`];
      result.push(patterns[i % patterns.length]);
    } else {
      result.push(pool[i % pool.length]);
    }
  }

  return result.join(' ');
}
