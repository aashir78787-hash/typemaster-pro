/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BADGES, Badge } from '../data/badges';
import { soundManager } from '../utils/soundEngine';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  coins: number;
  avatar: string;
  selectedCar: string;
  unlockedCars: string[];
}

export interface TestResultRecord {
  id: string;
  date: string;
  wpm: number;
  grossWpm: number;
  accuracy: number;
  cpm: number;
  timeSec: number;
  mode: string;
  textTitle: string;
  errors: number;
  weakKeysInTest?: string[];
}

export interface KeyStatsRecord {
  hits: number;
  errors: number;
  totalLatencyMs: number;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'matrix' | 'cyber' | 'retro' | 'dracula' | 'nord';
  fontFamily: 'sans' | 'mono' | 'dyslexic' | 'serif';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  caretStyle: 'bar' | 'block' | 'underline' | 'pulse';
  soundTheme: 'mechanical' | 'typewriter' | 'soft' | 'cyber' | 'off';
  soundVolume: number;
  stopOnError: boolean;
  showKeyboard: boolean;
  showHands: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  fontFamily: 'sans',
  fontSize: 'lg',
  caretStyle: 'bar',
  soundTheme: 'mechanical',
  soundVolume: 0.5,
  stopOnError: false,
  showKeyboard: true,
  showHands: true,
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_' + Math.random().toString(36).substring(2, 9),
  username: 'SpeedTypist',
  email: 'typist@typemaster.pro',
  xp: 120,
  level: 1,
  coins: 250,
  avatar: '⚡',
  selectedCar: 'classic-red',
  unlockedCars: ['classic-red'],
};

const STORAGE_KEYS = {
  PROFILE: 'tm_profile_v1',
  SETTINGS: 'tm_settings_v1',
  LESSONS: 'tm_lessons_v1',
  RESULTS: 'tm_results_v1',
  KEY_STATS: 'tm_keystats_v1',
  BADGES: 'tm_badges_v1',
  GAMES: 'tm_games_v1',
  STREAK: 'tm_streak_v1',
};

// Calculate level based on XP (each level requires Level * 250 XP)
export function getLevelForXp(xp: number): { level: number; currentXp: number; nextLevelXp: number; progressPercent: number } {
  let level = 1;
  let needed = 250;
  let remaining = xp;

  while (remaining >= needed) {
    remaining -= needed;
    level++;
    needed = level * 250;
  }

  return {
    level,
    currentXp: remaining,
    nextLevelXp: needed,
    progressPercent: Math.min(100, Math.round((remaining / needed) * 100)),
  };
}

class Store {
  private listeners = new Set<() => void>();

  public profile: UserProfile = DEFAULT_PROFILE;
  public settings: AppSettings = DEFAULT_SETTINGS;
  public lessonProgress: Record<number, { completed: boolean; stars: number; bestWpm: number; bestAcc: number }> = {
    1: { completed: true, stars: 2, bestWpm: 22, bestAcc: 97 }
  };
  public testResults: TestResultRecord[] = [
    {
      id: 'res-sample-1',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      wpm: 42,
      grossWpm: 45,
      accuracy: 96,
      cpm: 210,
      timeSec: 60,
      mode: '1 min test',
      textTitle: 'Top Common Words',
      errors: 4,
    },
    {
      id: 'res-sample-2',
      date: new Date(Date.now() - 86400000).toISOString(),
      wpm: 48,
      grossWpm: 50,
      accuracy: 98,
      cpm: 240,
      timeSec: 60,
      mode: '1 min test',
      textTitle: 'Simplicity & Genius',
      errors: 2,
    }
  ];
  public keyStats: Record<string, KeyStatsRecord> = {
    'q': { hits: 25, errors: 4, totalLatencyMs: 3800 },
    'z': { hits: 18, errors: 5, totalLatencyMs: 3200 },
    'p': { hits: 45, errors: 6, totalLatencyMs: 5100 },
    'b': { hits: 60, errors: 7, totalLatencyMs: 7200 },
  };
  public unlockedBadges: string[] = ['speed-20', 'speed-40', 'streak-1', 'lesson-1'];
  public gameScores: Record<string, number> = {
    race: 1,
    wordrain: 850,
    zombie: 450,
    balloon: 22,
    scramble: 7,
    accuracy: 14,
    keyhunter: 48,
  };
  public streak = {
    current: 3,
    longest: 5,
    lastPracticeDate: new Date().toISOString().split('T')[0],
    activeDates: [
      new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
  };

  // UI state
  public activeTab: 'lessons' | 'test' | 'games' | 'race' | 'dashboard' | 'leaderboard' | 'profile' = 'lessons';
  public activeLessonId: number | null = 1;
  public activeGameId: string | null = null;
  public newlyUnlockedBadge: Badge | null = null;
  public isPlacementModalOpen = false;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const p = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (p) this.profile = { ...DEFAULT_PROFILE, ...JSON.parse(p) };

      const s = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (s) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(s) };
      }
      if (!localStorage.getItem('tm_theme_migrated_v2')) {
        this.settings.theme = 'light';
        this.settings.fontFamily = 'sans';
        localStorage.setItem('tm_theme_migrated_v2', 'true');
      }
      soundManager.setSoundEnabled(this.settings.soundTheme !== 'off');
      soundManager.setTheme(this.settings.soundTheme);
      soundManager.setVolume(this.settings.soundVolume);

      const l = localStorage.getItem(STORAGE_KEYS.LESSONS);
      if (l) this.lessonProgress = JSON.parse(l);

      const r = localStorage.getItem(STORAGE_KEYS.RESULTS);
      if (r) this.testResults = JSON.parse(r);

      const k = localStorage.getItem(STORAGE_KEYS.KEY_STATS);
      if (k) this.keyStats = JSON.parse(k);

      const b = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (b) this.unlockedBadges = JSON.parse(b);

      const g = localStorage.getItem(STORAGE_KEYS.GAMES);
      if (g) this.gameScores = JSON.parse(g);

      const st = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (st) this.streak = JSON.parse(st);
    } catch {
      // Fallback on defaults
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(this.profile));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(this.lessonProgress));
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(this.testResults));
      localStorage.setItem(STORAGE_KEYS.KEY_STATS, JSON.stringify(this.keyStats));
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(this.unlockedBadges));
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(this.gameScores));
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(this.streak));
    } catch {
      // ignore quota errors
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach(fn => fn());
  }

  public setTab(tab: 'lessons' | 'test' | 'games' | 'race' | 'dashboard' | 'leaderboard' | 'profile') {
    this.activeTab = tab;
    this.notify();
  }

  public toggleTheme() {
    this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
    this.notify();
  }

  public setActiveLesson(lessonId: number | null) {
    this.activeLessonId = lessonId;
    this.activeTab = 'lessons';
    this.notify();
  }

  public setActiveGame(gameId: string | null) {
    this.activeGameId = gameId;
    this.activeTab = 'games';
    this.notify();
  }

  public openPlacementTest(open: boolean) {
    this.isPlacementModalOpen = open;
    this.notify();
  }

  public dismissBadgeModal() {
    this.newlyUnlockedBadge = null;
    this.notify();
  }

  public updateSettings(partial: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...partial };
    if (partial.soundTheme !== undefined) {
      soundManager.setTheme(this.settings.soundTheme);
      soundManager.setSoundEnabled(this.settings.soundTheme !== 'off');
    }
    if (partial.soundVolume !== undefined) {
      soundManager.setVolume(this.settings.soundVolume);
    }
    this.notify();
  }

  public updateProfile(partial: Partial<UserProfile>) {
    this.profile = { ...this.profile, ...partial };
    this.notify();
  }

  public addXpAndCoins(xpGained: number, coinsGained = 0) {
    const oldLevel = getLevelForXp(this.profile.xp).level;
    const newXp = this.profile.xp + xpGained;
    const newLevel = getLevelForXp(newXp).level;

    this.profile.xp = newXp;
    this.profile.level = newLevel;
    this.profile.coins += coinsGained;

    if (newLevel > oldLevel) {
      soundManager.playLevelUp();
    }
    this.checkBadges();
    this.updateStreak();
    this.notify();
  }

  public recordLessonCompletion(lessonId: number, wpm: number, accuracy: number, stars: number) {
    const prev = this.lessonProgress[lessonId];
    this.lessonProgress[lessonId] = {
      completed: true,
      stars: Math.max(prev?.stars || 0, stars),
      bestWpm: Math.max(prev?.bestWpm || 0, wpm),
      bestAcc: Math.max(prev?.bestAcc || 0, accuracy),
    };

    // Award XP
    const xpReward = stars * 60 + 50;
    const coinsReward = stars * 15;
    this.addXpAndCoins(xpReward, coinsReward);
    this.notify();
  }

  public recordTestResult(res: Omit<TestResultRecord, 'id' | 'date'>) {
    const newRecord: TestResultRecord = {
      ...res,
      id: 'res_' + Date.now(),
      date: new Date().toISOString(),
    };
    this.testResults.unshift(newRecord);

    // Add XP based on WPM and accuracy
    const xpEarned = Math.round((res.wpm * (res.accuracy / 100)) * (res.timeSec / 30) * 1.5);
    const coinsEarned = Math.round(res.wpm / 4);
    this.addXpAndCoins(xpEarned, coinsEarned);
    this.notify();
  }

  public recordKeyHit(char: string, isError: boolean, latencyMs = 200) {
    const c = char.toLowerCase();
    if (!c || c.length !== 1) return;
    const current = this.keyStats[c] || { hits: 0, errors: 0, totalLatencyMs: 0 };
    this.keyStats[c] = {
      hits: current.hits + 1,
      errors: current.errors + (isError ? 1 : 0),
      totalLatencyMs: current.totalLatencyMs + latencyMs,
    };
    // don't notify on every keystroke to prevent re-render lag
  }

  public getWeakKeys(threshold = 0.12): string[] {
    const weak: { key: string; errorRate: number }[] = [];
    Object.entries(this.keyStats).forEach(([key, stat]) => {
      if (stat.hits >= 5) {
        const errorRate = stat.errors / stat.hits;
        if (errorRate >= threshold) {
          weak.push({ key, errorRate });
        }
      }
    });
    weak.sort((a, b) => b.errorRate - a.errorRate);
    return weak.slice(0, 5).map(w => w.key);
  }

  public recordGameScore(gameId: string, score: number) {
    const prev = this.gameScores[gameId] || 0;
    if (score > prev) {
      this.gameScores[gameId] = score;
    }
    const xp = Math.min(300, Math.round(score / 5) + 30);
    const coins = Math.min(100, Math.round(score / 15) + 10);
    this.addXpAndCoins(xp, coins);
    this.notify();
  }

  public buyCar(carId: string, price: number) {
    if (this.profile.coins >= price && !this.profile.unlockedCars.includes(carId)) {
      this.profile.coins -= price;
      this.profile.unlockedCars.push(carId);
      this.profile.selectedCar = carId;
      this.notify();
      return true;
    }
    return false;
  }

  private updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (this.streak.lastPracticeDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (this.streak.lastPracticeDate === yesterday) {
      this.streak.current += 1;
      this.streak.longest = Math.max(this.streak.longest, this.streak.current);
    } else {
      this.streak.current = 1;
    }
    this.streak.lastPracticeDate = today;
    if (!this.streak.activeDates.includes(today)) {
      this.streak.activeDates.push(today);
    }
  }

  public checkBadges() {
    const highestWpm = Math.max(0, ...this.testResults.map(r => r.wpm));
    const highestAcc = Math.max(0, ...this.testResults.map(r => r.accuracy));
    const completedLessonsCount = Object.values(this.lessonProgress).filter(l => l.completed).length;

    BADGES.forEach(badge => {
      if (this.unlockedBadges.includes(badge.id)) return;

      let unlock = false;
      if (badge.id === 'speed-20' && highestWpm >= 20) unlock = true;
      if (badge.id === 'speed-40' && highestWpm >= 40) unlock = true;
      if (badge.id === 'speed-60' && highestWpm >= 60) unlock = true;
      if (badge.id === 'speed-80' && highestWpm >= 80) unlock = true;
      if (badge.id === 'speed-100' && highestWpm >= 100) unlock = true;
      if (badge.id === 'speed-120' && highestWpm >= 120) unlock = true;

      if (badge.id === 'acc-98' && highestAcc >= 98) unlock = true;
      if (badge.id === 'acc-100' && this.testResults.some(r => r.accuracy === 100 && r.timeSec >= 60)) unlock = true;

      if (badge.id === 'streak-1' && this.streak.current >= 1) unlock = true;
      if (badge.id === 'streak-3' && this.streak.current >= 3) unlock = true;
      if (badge.id === 'streak-7' && this.streak.current >= 7) unlock = true;
      if (badge.id === 'streak-30' && this.streak.current >= 30) unlock = true;

      if (badge.id === 'lesson-1' && completedLessonsCount >= 1) unlock = true;
      if (badge.id === 'lesson-l1' && [1,2,3,4,5,6,7,8].every(id => this.lessonProgress[id]?.completed)) unlock = true;
      if (badge.id === 'lesson-all' && completedLessonsCount >= 40) unlock = true;

      if (unlock) {
        this.unlockedBadges.push(badge.id);
        this.newlyUnlockedBadge = badge;
        soundManager.playCombo();
        // Dynamically import confetti
        import('canvas-confetti').then(confetti => {
          confetti.default({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }).catch(() => {});
      }
    });
  }
}

export const appStore = new Store();

export function useAppStore() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    return appStore.subscribe(() => {
      setVersion(v => v + 1);
    });
  }, []);

  return appStore;
}
