/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'speed' | 'accuracy' | 'streak' | 'lessons' | 'games' | 'special';
  icon: string;
  xp: number;
}

export const BADGES: Badge[] = [
  // Speed
  { id: 'speed-20', name: 'First Key Strokes', description: 'Reach 20 WPM on any typing test or lesson.', category: 'speed', icon: 'Footprints', xp: 50 },
  { id: 'speed-40', name: 'Swift Fingers', description: 'Reach 40 WPM on any typing test.', category: 'speed', icon: 'Zap', xp: 100 },
  { id: 'speed-60', name: 'Speed Demon', description: 'Break the 60 WPM barrier.', category: 'speed', icon: 'Flame', xp: 200 },
  { id: 'speed-80', name: 'Hyper Velocity', description: 'Achieve 80 WPM with high accuracy.', category: 'speed', icon: 'Rocket', xp: 350 },
  { id: 'speed-100', name: 'Century Club', description: 'Join the legendary 100+ WPM elite club.', category: 'speed', icon: 'Crown', xp: 600 },
  { id: 'speed-120', name: 'Grandmaster Typist', description: 'Reach a blistering 120 WPM.', category: 'speed', icon: 'Sparkles', xp: 1000 },

  // Accuracy
  { id: 'acc-98', name: 'Precision Striker', description: 'Complete a test with at least 98% accuracy.', category: 'accuracy', icon: 'Target', xp: 100 },
  { id: 'acc-100', name: 'Flawless Execution', description: 'Score a perfect 100% accuracy on a 60-second test.', category: 'accuracy', icon: 'CheckCheck', xp: 300 },
  { id: 'acc-streak', name: 'Surgical Consistency', description: 'Complete 3 tests in a row with 98%+ accuracy.', category: 'accuracy', icon: 'Crosshair', xp: 400 },

  // Streaks & Dedication
  { id: 'streak-1', name: 'Day One Spark', description: 'Complete your first practice day.', category: 'streak', icon: 'Calendar', xp: 50 },
  { id: 'streak-3', name: 'Habit Forming', description: 'Maintain a 3-day typing practice streak.', category: 'streak', icon: 'CalendarCheck', xp: 150 },
  { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day practice streak.', category: 'streak', icon: 'Award', xp: 350 },
  { id: 'streak-30', name: 'Iron Dedication', description: 'Complete 30 consecutive days of typing practice.', category: 'streak', icon: 'ShieldCheck', xp: 1000 },

  // Lessons
  { id: 'lesson-1', name: 'The Journey Begins', description: 'Complete your very first lesson with passing grade.', category: 'lessons', icon: 'BookOpen', xp: 50 },
  { id: 'lesson-l1', name: 'Home Row Master', description: 'Complete all 8 Home Row lessons in Level 1.', category: 'lessons', icon: 'Home', xp: 200 },
  { id: 'lesson-l2', name: 'Top Row Conquered', description: 'Complete all Level 2 Top Row lessons.', category: 'lessons', icon: 'ArrowUpCircle', xp: 250 },
  { id: 'lesson-l3', name: 'Bottom Row Virtuoso', description: 'Complete all Level 3 Bottom Row lessons.', category: 'lessons', icon: 'ArrowDownCircle', xp: 300 },
  { id: 'lesson-l4', name: 'Symbol Specialist', description: 'Complete all Level 4 Numbers & Symbols lessons.', category: 'lessons', icon: 'Hash', xp: 400 },
  { id: 'lesson-all', name: 'Typing Professor', description: 'Complete all 40 structured lessons in the academy.', category: 'lessons', icon: 'GraduationCap', xp: 1500 },
  { id: 'lesson-3stars', name: 'Triple Star Titan', description: 'Earn 3 stars on at least 10 lessons.', category: 'lessons', icon: 'Star', xp: 500 },

  // Games & Racing
  { id: 'game-race-win', name: 'Podium Champion', description: 'Win 1st place in a typing race.', category: 'games', icon: 'Trophy', xp: 200 },
  { id: 'game-race-pro', name: 'Beast Slayer', description: 'Defeat the Cyber Beast Pro AI bot in a race.', category: 'games', icon: 'Swords', xp: 450 },
  { id: 'game-wordrain', name: 'Rainmaker', description: 'Score 1,000+ points in Falling Words.', category: 'games', icon: 'CloudRain', xp: 200 },
  { id: 'game-zombie', name: 'Apocalypse Survivor', description: 'Defeat Wave 3 Boss in Zombie Defense.', category: 'games', icon: 'ShieldAlert', xp: 250 },
  { id: 'game-balloon', name: 'Sky High Popper', description: 'Pop 30 balloons in Balloon Pop.', category: 'games', icon: 'Compass', xp: 150 },
  { id: 'game-scramble', name: 'Speed Speller', description: 'Unscramble 10 words in Word Scramble.', category: 'games', icon: 'Shuffle', xp: 200 },
  { id: 'game-accuracy', name: 'Zero Mistake Run', description: 'Survive 30 words in Sudden Death Accuracy Challenge.', category: 'games', icon: 'AlertOctagon', xp: 300 },

  // Special
  { id: 'special-code', name: 'Code Ninja', description: 'Complete a programming code snippet test above 45 WPM.', category: 'special', icon: 'Code', xp: 300 },
  { id: 'special-night', name: 'Night Owl', description: 'Practice typing between 10 PM and 4 AM.', category: 'special', icon: 'Moon', xp: 150 }
];
