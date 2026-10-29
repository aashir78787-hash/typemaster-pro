/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: number;
  level: number;
  levelName: string;
  title: string;
  description: string;
  handGuideTip: string;
  targetWpm: number;
  targetAccuracy: number;
  keysFocus: string[];
  text: string;
}

export const LESSONS: Lesson[] = [
  // ================= LEVEL 1: HOME ROW FUNDAMENTALS (1-8) =================
  {
    id: 1,
    level: 1,
    levelName: 'Home Row Fundamentals',
    title: 'The Anchor Keys: F and J',
    description: 'Feel the small raised tactile bumps on F and J with your left and right index fingers.',
    handGuideTip: 'Rest left index finger on F, right index finger on J. Hit Space with your thumb.',
    targetWpm: 15,
    targetAccuracy: 95,
    keysFocus: ['f', 'j', ' '],
    text: 'f j f j ff jj fj jf fff jjj fjf jfj f j f j ff jj f f j j fj fj'
  },
  {
    id: 2,
    level: 1,
    levelName: 'Home Row Fundamentals',
    title: 'Middle Fingers: D and K',
    description: 'Add your middle fingers resting on D (left hand) and K (right hand).',
    handGuideTip: 'Keep your fingers curved naturally like holding a baseball. Keep wrists raised.',
    targetWpm: 18,
    targetAccuracy: 95,
    keysFocus: ['d', 'k'],
    text: 'd k d k dd kk dk kd f d j k fd jk df kj ddd kkk dfjk kfdj d k'
  },
  {
    id: 3,
    level: 1,
    levelName: 'Home Row Fundamentals',
    title: 'Ring Fingers: S and L',
    description: 'Bring the ring fingers into play with S on the left and L on the right.',
    handGuideTip: 'Do not look at the keyboard. Train your tactile muscle memory.',
    targetWpm: 20,
    targetAccuracy: 95,
    keysFocus: ['s', 'l'],
    text: 's l s l ss ll sl ls as df jk l; s d f j k l sldk sl dk lskd'
  },
  {
    id: 4,
    level: 1,
    levelName: 'Home Row Fundamentals',
    title: 'Pinky Fingers: A and Semicolon',
    description: 'Complete the base home row with left pinky on A and right pinky on semicolon.',
    handGuideTip: 'Pinky fingers are weaker initially. Relax and strike with a light, crisp tap.',
    targetWpm: 20,
    targetAccuracy: 95,
    keysFocus: ['a', ';'],
    text: 'a ; a ; aa ;; a; ;a as df j k l; asdf jkl; a s d f j k l ;'
  },
  {
    id: 5,
    level: 1,
    levelName: 'Home Row Fundamentals',
    title: 'Center Reaches: G and H',
    description: 'Stretch the index fingers horizontally to reach G (left) and H (right).',
    handGuideTip: 'Stretch index finger to G or H and quickly snap back to home position F or J.',
    targetWpm: 22,
    targetAccuracy: 95,
    keysFocus: ['g', 'h'],
    text: 'f g f j h j fg jh gf hj glad half flag flash dash fall gall flask'
  },
  {
    id: 6,
    level: 1,
    levelName: 'Home Row Fundamentals',
    title: 'Home Row Words & Combos',
    description: 'Combine all eight home row keys into real English words and flow patterns.',
    handGuideTip: 'Maintain a steady, rhythmic metronome cadence rather than burst typing.',
    targetWpm: 25,
    targetAccuracy: 95,
    keysFocus: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    text: 'ask dad had fall glad half shall salad flask gas dash flash glass alfalfa'
  },
  {
    id: 7,
    level: 1,
    levelName: 'Home Row Fundamentals',
    title: 'Home Row Sentences',
    description: 'Type natural sentences formed entirely from the home row keys.',
    handGuideTip: 'Keep your palms hovering slightly above the table or keyboard wrist rest.',
    targetWpm: 28,
    targetAccuracy: 95,
    keysFocus: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    text: 'a glad lad had a flag. all lads had salads. dad shall ask a half glass.'
  },
  {
    id: 8,
    level: 1,
    levelName: 'Home Row Fundamentals',
    title: 'Level 1 Speed Checkpoint',
    description: 'Test your mastery and speed across all home row keys to unlock Level 2.',
    handGuideTip: 'Prioritize precision over raw speed. Smooth typing yields fast speed.',
    targetWpm: 30,
    targetAccuracy: 96,
    keysFocus: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    text: 'glad dad had a flash flag. shall a lad fall as a gall flask dashes past?'
  },

  // ================= LEVEL 2: TOP ROW MASTERY (9-16) =================
  {
    id: 9,
    level: 2,
    levelName: 'Top Row Mastery',
    title: 'Index Reaches: R and U',
    description: 'Reach upward with your index fingers to tap R (left index) and U (right index).',
    handGuideTip: 'Reach up from F to R, and from J to U, then immediately return home.',
    targetWpm: 25,
    targetAccuracy: 95,
    keysFocus: ['r', 'u'],
    text: 'f r f j u j fr ju rf uj fur run rug jar jug far raw fur fur jar'
  },
  {
    id: 10,
    level: 2,
    levelName: 'Top Row Mastery',
    title: 'Middle Reaches: E and I',
    description: 'Reach up from D to E with the left middle finger, and from K to I with the right.',
    handGuideTip: 'E and I are the two most common vowels in English. Keep transitions smooth.',
    targetWpm: 28,
    targetAccuracy: 95,
    keysFocus: ['e', 'i'],
    text: 'd e d k i k de ki ed ik kid red fire side like life see feel seek ride'
  },
  {
    id: 11,
    level: 2,
    levelName: 'Top Row Mastery',
    title: 'Ring Reaches: W and O',
    description: 'Reach up with ring fingers from S to W (left) and from L to O (right).',
    handGuideTip: 'Keep other fingers resting softly on their home keys while reaching.',
    targetWpm: 28,
    targetAccuracy: 95,
    keysFocus: ['w', 'o'],
    text: 's w s l o l sw lo ws ol owl low wow look wood wool slow flow show'
  },
  {
    id: 12,
    level: 2,
    levelName: 'Top Row Mastery',
    title: 'Pinky Reaches: Q and P',
    description: 'Extend pinkies up to the furthest top row corners: Q on the left, P on the right.',
    handGuideTip: 'Pinkies require deliberate finger isolation. Avoid twisting your entire hand.',
    targetWpm: 26,
    targetAccuracy: 95,
    keysFocus: ['q', 'p'],
    text: 'a q a ; p ; aq ;p qa p; quit quick pool plan drop soup quiet queen loop'
  },
  {
    id: 13,
    level: 2,
    levelName: 'Top Row Mastery',
    title: 'Center Top Reaches: T and Y',
    description: 'Reach up diagonally with index fingers to T (left) and Y (right).',
    handGuideTip: 'Reach up and inward with index fingers. Keep home row as base station.',
    targetWpm: 30,
    targetAccuracy: 95,
    keysFocus: ['t', 'y'],
    text: 'f t f j y j ft jy tf yj they you your city year try yet toys stay tree'
  },
  {
    id: 14,
    level: 2,
    levelName: 'Top Row Mastery',
    title: 'Top Row Integration',
    description: 'Fluidly transition between top row reaches and home row keys.',
    handGuideTip: 'Feel the rhythm. Typing is like playing an instrument with 10 fingers.',
    targetWpm: 32,
    targetAccuracy: 95,
    keysFocus: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    text: 'water route quiet poetry write your report without delay or quick doubt'
  },
  {
    id: 15,
    level: 2,
    levelName: 'Top Row Mastery',
    title: 'Common Top Row Phrases',
    description: 'Type high-frequency phrases combining top row and home row vocabulary.',
    handGuideTip: 'Notice common bigrams like "th", "er", "on", "in", and "ed".',
    targetWpm: 34,
    targetAccuracy: 96,
    keysFocus: ['all top and home'],
    text: 'the true power of your work will speak for itself today and tomorrow'
  },
  {
    id: 16,
    level: 2,
    levelName: 'Top Row Mastery',
    title: 'Level 2 Speed Checkpoint',
    description: 'Demonstrate effortless transitions between Home Row and Top Row.',
    handGuideTip: 'Breathe steadily. Relax your shoulders and neck muscles.',
    targetWpm: 36,
    targetAccuracy: 96,
    keysFocus: ['home row', 'top row'],
    text: 'people who write daily discover that quiet patience yields great quality'
  },

  // ================= LEVEL 3: BOTTOM ROW MASTERY (17-24) =================
  {
    id: 17,
    level: 3,
    levelName: 'Bottom Row Mastery',
    title: 'Index Bottom: V and M',
    description: 'Curl left index down from F to V, and right index from J to M.',
    handGuideTip: 'Curl the finger down and inwards under your hand posture.',
    targetWpm: 28,
    targetAccuracy: 95,
    keysFocus: ['v', 'm'],
    text: 'f v f j m j fv jm vf mj vim move make view wave most more save live'
  },
  {
    id: 18,
    level: 3,
    levelName: 'Bottom Row Mastery',
    title: 'Middle Bottom: C and Comma',
    description: 'Reach down with middle fingers: left to C, right to the Comma key (,).',
    handGuideTip: 'Use your right middle finger for the comma. Pause briefly after commas in mind.',
    targetWpm: 30,
    targetAccuracy: 95,
    keysFocus: ['c', ','],
    text: 'd c d k , k dc k, cd ,k call, calm, clear, cold, cool, climb, code, cloud'
  },
  {
    id: 19,
    level: 3,
    levelName: 'Bottom Row Mastery',
    title: 'Ring Bottom: X and Period',
    description: 'Reach down with ring fingers: left to X, right to Period (.).',
    handGuideTip: 'Tap the period key with your right ring finger. Space once after sentence period.',
    targetWpm: 30,
    targetAccuracy: 95,
    keysFocus: ['x', '.'],
    text: 's x s l . l sx l. xs .l six. next. exam. text. box. exact mix. fix it now.'
  },
  {
    id: 20,
    level: 3,
    levelName: 'Bottom Row Mastery',
    title: 'Pinky Bottom: Z and Slash',
    description: 'Drop pinkies down to reach Z (left pinky) and forward slash / (right pinky).',
    handGuideTip: 'Z requires tucking the left pinky down. Keep wrist aligned.',
    targetWpm: 28,
    targetAccuracy: 95,
    keysFocus: ['z', '/'],
    text: 'a z a ; / ; az ;/ za /; zero zoom zone maze gaze prize lazy size zip'
  },
  {
    id: 21,
    level: 3,
    levelName: 'Bottom Row Mastery',
    title: 'Center Bottom: B and N',
    description: 'Stretch down inward with index fingers: B (left index) and N (right index).',
    handGuideTip: 'B is often reached by left index. N is reached by right index.',
    targetWpm: 32,
    targetAccuracy: 95,
    keysFocus: ['b', 'n'],
    text: 'f b f j n j fb jn bf nj best book bird brand name nine bone brown bank'
  },
  {
    id: 22,
    level: 3,
    levelName: 'Bottom Row Mastery',
    title: 'Full Alphabet Pangrams',
    description: 'Practice classic sentences that exercise every letter of the English alphabet.',
    handGuideTip: 'Pangrams stretch all finger pathways uniformly across the entire board.',
    targetWpm: 35,
    targetAccuracy: 95,
    keysFocus: ['a-z'],
    text: 'the quick brown fox jumps over the lazy dog and packs five dozen jugs of liquid'
  },
  {
    id: 23,
    level: 3,
    levelName: 'Bottom Row Mastery',
    title: 'Punctuation & Flow',
    description: 'Seamlessly blend commas, periods, and rapid word combinations.',
    handGuideTip: 'Do not pause awkwardly when reaching for commas or periods.',
    targetWpm: 36,
    targetAccuracy: 96,
    keysFocus: [',', '.', 'a-z'],
    text: 'practice brings speed, patience brings mastery, and focus builds true precision.'
  },
  {
    id: 24,
    level: 3,
    levelName: 'Bottom Row Mastery',
    title: 'Level 3 Speed Checkpoint',
    description: 'Full three-row keyboard navigation test under realistic paragraph conditions.',
    handGuideTip: 'Aim for continuous unbroken typing without looking down.',
    targetWpm: 40,
    targetAccuracy: 96,
    keysFocus: ['full alpha'],
    text: 'brave explorers venture across wild frozen lands to find ancient secret gems.'
  },

  // ================= LEVEL 4: NUMBERS & SYMBOLS (25-32) =================
  {
    id: 25,
    level: 4,
    levelName: 'Numbers & Symbols',
    title: 'Shift Keys & Capitalization',
    description: 'Hold opposite Shift key with pinky while striking the target letter.',
    handGuideTip: 'Rule: Use Right Shift when typing left-hand letters, Left Shift for right-hand letters!',
    targetWpm: 34,
    targetAccuracy: 95,
    keysFocus: ['Shift', 'A-Z'],
    text: 'London Paris Tokyo New York Berlin Rome Madrid Sydney Toronto Chicago'
  },
  {
    id: 26,
    level: 4,
    levelName: 'Numbers & Symbols',
    title: 'Number Row: 1, 2, 3, 4, 5',
    description: 'Reach up from home row to the left side numbers 1 through 5.',
    handGuideTip: '1 (Pinky), 2 (Ring), 3 (Middle), 4 and 5 (Index). Return to home row immediately.',
    targetWpm: 30,
    targetAccuracy: 94,
    keysFocus: ['1', '2', '3', '4', '5'],
    text: '123 451 234 512 345 11 22 33 44 55 12 34 51 25 31 42 15 24 35 14'
  },
  {
    id: 27,
    level: 4,
    levelName: 'Numbers & Symbols',
    title: 'Number Row: 6, 7, 8, 9, 0',
    description: 'Reach up from home row to the right side numbers 6 through 0.',
    handGuideTip: '6 and 7 (Index), 8 (Middle), 9 (Ring), 0 (Pinky). Maintain consistent hand angle.',
    targetWpm: 30,
    targetAccuracy: 94,
    keysFocus: ['6', '7', '8', '9', '0'],
    text: '678 906 789 067 890 66 77 88 99 00 67 89 06 70 86 97 60 78 90 69'
  },
  {
    id: 28,
    level: 4,
    levelName: 'Numbers & Symbols',
    title: 'Mixed Numerical Data',
    description: 'Type mixed years, quantities, telephone formats, and addresses.',
    handGuideTip: 'Resist looking at the number row. Build the upward vertical muscle memory.',
    targetWpm: 32,
    targetAccuracy: 94,
    keysFocus: ['0-9'],
    text: 'in 1995 there were 342 units, by 2018 we had 7850 active nodes across 12 regions.'
  },
  {
    id: 29,
    level: 4,
    levelName: 'Numbers & Symbols',
    title: 'Essential Symbols: ! @ # $ %',
    description: 'Shift + numbers 1 through 5 produce common symbols.',
    handGuideTip: 'Hold Right Shift with right pinky while left hand strikes 1, 2, 3, 4, or 5.',
    targetWpm: 28,
    targetAccuracy: 94,
    keysFocus: ['!', '@', '#', '$', '%'],
    text: 'save 20%! cost is $450; user@domain.com tag #success with 100% effort!'
  },
  {
    id: 30,
    level: 4,
    levelName: 'Numbers & Symbols',
    title: 'Math & Quotes: & * ( ) - + =',
    description: 'Shift + right side numbers plus hyphens, equals, and quote marks.',
    handGuideTip: 'Use Left Shift for right-hand symbols like parentheses ( and ).',
    targetWpm: 28,
    targetAccuracy: 94,
    keysFocus: ['&', '*', '(', ')', '-', '+', '='],
    text: 'formula: (x + y) * (a - b) = total; items: bread & butter + sweet honey.'
  },
  {
    id: 31,
    level: 4,
    levelName: 'Numbers & Symbols',
    title: 'Brackets & Punctuation: [ ] { } : "',
    description: 'Master code enclosures and formal punctuation keys.',
    handGuideTip: 'Right pinky controls brackets, braces, and colon keys.',
    targetWpm: 30,
    targetAccuracy: 94,
    keysFocus: ['[', ']', '{', '}', ':', '"'],
    text: 'data: { name: "Alice", scores: [98, 95, 100], status: "verified" }'
  },
  {
    id: 32,
    level: 4,
    levelName: 'Numbers & Symbols',
    title: 'Level 4 Speed Checkpoint',
    description: 'Comprehensive test featuring mixed alphanumeric and symbolic text.',
    handGuideTip: 'Keep a calm cadence. Symbolic transitions require clean muscle isolation.',
    targetWpm: 35,
    targetAccuracy: 95,
    keysFocus: ['alphanumeric + symbols'],
    text: 'Order #4892: 15 items @ $32.50 each (total: $487.50). Discount rate was 10%!'
  },

  // ================= LEVEL 5: ADVANCED SPEED, CODE & PROSE (33-40) =================
  {
    id: 33,
    level: 5,
    levelName: 'Advanced Speed & Code',
    title: 'JavaScript & Web Syntax',
    description: 'Train on real programming tokens, camelCase variables, and arrow functions.',
    handGuideTip: 'Programmers type 30% symbols. Fluid bracket and semicolon reaches are key.',
    targetWpm: 38,
    targetAccuracy: 95,
    keysFocus: ['code syntax'],
    text: 'const calculateTotal = (items, taxRate = 0.08) => items.reduce((acc, cur) => acc + cur.price, 0) * (1 + taxRate);'
  },
  {
    id: 34,
    level: 5,
    levelName: 'Advanced Speed & Code',
    title: 'Python & Backend Logic',
    description: 'Python syntax with def, return, underscores, dictionaries, and list comprehensions.',
    handGuideTip: 'Notice the rhythm of underscores and colon indents.',
    targetWpm: 40,
    targetAccuracy: 95,
    keysFocus: ['python syntax'],
    text: 'def filter_active_users(users: list) -> list:\n    return [u for u in users if u.get("is_active") and u["score"] > 80]'
  },
  {
    id: 35,
    level: 5,
    levelName: 'Advanced Speed & Code',
    title: 'High Velocity Word Sprint',
    description: 'The top 100 most frequent English words typed at maximum burst speed.',
    handGuideTip: 'Look ahead 1-2 words into the buffer while typing the current word.',
    targetWpm: 48,
    targetAccuracy: 96,
    keysFocus: ['high-frequency words'],
    text: 'time will tell how well each person learns to type with poise and lightning quick speed under pressure'
  },
  {
    id: 36,
    level: 5,
    levelName: 'Advanced Speed & Code',
    title: 'Literary Prose: Scientific Curiosity',
    description: 'Inspiring prose by Carl Sagan exploring cosmos and human discovery.',
    handGuideTip: 'Maintain deep breathing and zero tension in hands, arms, and back.',
    targetWpm: 45,
    targetAccuracy: 96,
    keysFocus: ['complex prose'],
    text: 'Somewhere, something incredible is waiting to be known. The cosmos is within us. We are made of star-stuff.'
  },
  {
    id: 37,
    level: 5,
    levelName: 'Advanced Speed & Code',
    title: 'Technical Terminology',
    description: 'Modern computing concepts: microservices, concurrency, encryption, and networks.',
    handGuideTip: 'Break unfamiliar long words into rhythmic phoneme syllables.',
    targetWpm: 46,
    targetAccuracy: 96,
    keysFocus: ['technical words'],
    text: 'Distributed consensus algorithms enable decentralized Byzantine fault tolerant state machine replication.'
  },
  {
    id: 38,
    level: 5,
    levelName: 'Advanced Speed & Code',
    title: 'The 60 WPM Barrier Breaker',
    description: 'Designed specifically to push your speed beyond the coveted 60 WPM milestone.',
    handGuideTip: 'Eliminate all micro-pauses between words. Hit space in the same flow as the last letter.',
    targetWpm: 55,
    targetAccuracy: 97,
    keysFocus: ['speed endurance'],
    text: 'Speed is not born from reckless haste, but from the complete elimination of hesitation and unnecessary movement.'
  },
  {
    id: 39,
    level: 5,
    levelName: 'Advanced Speed & Code',
    title: 'The 80 WPM Velocity Sprint',
    description: 'Intense endurance sprint for elite touch typists seeking grandmaster status.',
    handGuideTip: 'Your fingers should flutter like hummingbird wings across the keys.',
    targetWpm: 65,
    targetAccuracy: 97,
    keysFocus: ['grandmaster velocity'],
    text: 'True mastery appears effortless to those watching, because every single motion has been honed through thousands of deliberate repetitions.'
  },
  {
    id: 40,
    level: 5,
    levelName: 'Advanced Speed & Code',
    title: 'Grandmaster Certification Exam',
    description: 'The final comprehensive test across all keys, symbols, speeds, and mental focus.',
    handGuideTip: 'You have mastered touch typing. Breathe, focus, and let your fingers fly!',
    targetWpm: 60,
    targetAccuracy: 98,
    keysFocus: ['all characters'],
    text: 'Congratulations on reaching the ultimate milestone of TypeMaster Pro: 10 fingers, zero looking, and complete keyboard freedom!'
  }
];
