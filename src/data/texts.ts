/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TextCategory = 'words' | 'sentences' | 'paragraphs' | 'quotes' | 'code' | 'numbers' | 'custom';
export type TextDifficulty = 'easy' | 'medium' | 'hard';

export interface PracticeText {
  id: string;
  category: TextCategory;
  difficulty: TextDifficulty;
  title: string;
  authorOrSource?: string;
  content: string;
}

export const PRACTICE_TEXTS: PracticeText[] = [
  // --- WORDS ---
  {
    id: 'w-easy-1',
    category: 'words',
    difficulty: 'easy',
    title: 'Top Common Words',
    content: 'the be to of and a in that have i it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me'
  },
  {
    id: 'w-easy-2',
    category: 'words',
    difficulty: 'easy',
    title: 'Everyday Actions',
    content: 'walk run jump read write speak listen sing dance build make create dream think learn grow teach guide help care feel watch stand sleep eat drink play send call view'
  },
  {
    id: 'w-med-1',
    category: 'words',
    difficulty: 'medium',
    title: 'Modern Technology',
    content: 'algorithm bandwidth computer database encryption firewall gateway hardware internet javascript keyboard latency memory network operating processor quantum router software terminal system velocity'
  },
  {
    id: 'w-med-2',
    category: 'words',
    difficulty: 'medium',
    title: 'Natural World',
    content: 'atmosphere biosphere constellation horizon landscape mountain ocean peninsula rainforest savannah waterfall volcanic wilderness glacier avalanche ecosystem lightning eclipse archipelago'
  },
  {
    id: 'w-hard-1',
    category: 'words',
    difficulty: 'hard',
    title: 'Advanced Vocabulary',
    content: 'ephemeral quintessential serendipity idiosyncratic mellifluous recalcitrant surreptitious ubiquitous vicarious pernicious magnanimous obsequious fastidious esoteric idiosyncratic grandiloquent'
  },
  {
    id: 'w-hard-2',
    category: 'words',
    difficulty: 'hard',
    title: 'Scientific Phenomena',
    content: 'photosynthesis chromatography thermodynamics superconductivity luminescence bioluminescence electromagnetic bioenergetics paleontological crystallographic spectrophotometer bioengineering'
  },

  // --- QUOTES ---
  {
    id: 'q-1',
    category: 'quotes',
    difficulty: 'easy',
    title: 'Simplicity & Genius',
    authorOrSource: 'Steve Jobs',
    content: 'Simple can be harder than complex: You have to work hard to get your thinking clean to make it simple. But it is worth it in the end because once you get there, you can move mountains.'
  },
  {
    id: 'q-2',
    category: 'quotes',
    difficulty: 'medium',
    title: 'The Pale Blue Dot',
    authorOrSource: 'Carl Sagan',
    content: 'Look again at that dot. That is here. That is home. That is us. On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives.'
  },
  {
    id: 'q-3',
    category: 'quotes',
    difficulty: 'easy',
    title: 'Imagination',
    authorOrSource: 'Albert Einstein',
    content: 'Logic will get you from A to B. Imagination will take you everywhere. Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning.'
  },
  {
    id: 'q-4',
    category: 'quotes',
    difficulty: 'medium',
    title: 'The Man in the Arena',
    authorOrSource: 'Theodore Roosevelt',
    content: 'It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better. The credit belongs to the man who is actually in the arena.'
  },
  {
    id: 'q-5',
    category: 'quotes',
    difficulty: 'hard',
    title: 'Marcus Aurelius Meditations',
    authorOrSource: 'Marcus Aurelius',
    content: 'When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love. The happiness of your life depends upon the quality of your thoughts.'
  },
  {
    id: 'q-6',
    category: 'quotes',
    difficulty: 'easy',
    title: 'Persistence',
    authorOrSource: 'Maya Angelou',
    content: 'You may encounter many defeats, but you must not be defeated. In fact, it may be necessary to encounter the defeats, so you can know who you are, what you can rise from, how you can still come out.'
  },

  // --- SENTENCES & PARAGRAPHS ---
  {
    id: 'p-1',
    category: 'paragraphs',
    difficulty: 'easy',
    title: 'Morning in the Redwood Forest',
    content: 'Sunlight pierced through the towering redwood trees, casting long golden pillars upon the dewy forest floor. A cool mist hovered above the carpet of clover and wild ferns, carrying the fresh scent of cedar and pine needles. Nearby, a clear mountain brook tumbled merrily over smooth granite stones.'
  },
  {
    id: 'p-2',
    category: 'paragraphs',
    difficulty: 'medium',
    title: 'The Architecture of Cities',
    content: 'Great cities are not built merely of steel and stone; they are vibrant living tapestries woven from millions of shared dreams, hurried strides, and fleeting encounters. Underneath the neon skyline, avenues hum with the collective rhythm of human ambition, commerce, and unending artistic reinvention.'
  },
  {
    id: 'p-3',
    category: 'paragraphs',
    difficulty: 'hard',
    title: 'Quantum Mechanics and Reality',
    content: 'At the subatomic frontier, classical intuition dissolves into a mathematical landscape of probabilistic wavefunctions. Particles exist in superpositions of conflicting states until decoherence or measurement collapses the possibilities into definite observable outcomes.'
  },

  // --- CODE SNIPPETS ---
  {
    id: 'c-js-1',
    category: 'code',
    difficulty: 'medium',
    title: 'JavaScript Async Fetch',
    content: 'async function fetchUserData(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}`);\n    if (!response.ok) throw new Error("HTTP error: " + response.status);\n    const data = await response.json();\n    return data;\n  } catch (err) {\n    console.error("Failed to fetch user:", err);\n    return null;\n  }\n}'
  },
  {
    id: 'c-py-1',
    category: 'code',
    difficulty: 'medium',
    title: 'Python Binary Search',
    content: 'def binary_search(arr: list[int], target: int) -> int:\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1'
  },
  {
    id: 'c-react-1',
    category: 'code',
    difficulty: 'hard',
    title: 'React Custom Hook',
    content: 'function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n  return debouncedValue;\n}'
  },
  {
    id: 'c-sql-1',
    category: 'code',
    difficulty: 'easy',
    title: 'SQL Aggregations',
    content: 'SELECT u.id, u.username, COUNT(r.id) AS total_races, AVG(r.wpm) AS average_wpm\nFROM users u\nJOIN race_results r ON u.id = r.user_id\nWHERE r.created_at >= NOW() - INTERVAL 30 DAY\nGROUP BY u.id, u.username\nHAVING COUNT(r.id) >= 5\nORDER BY average_wpm DESC\nLIMIT 25;'
  },

  // --- NUMBERS & SYMBOLS ---
  {
    id: 'num-1',
    category: 'numbers',
    difficulty: 'medium',
    title: 'Financial & Mathematical Formulas',
    content: 'Invoice #84920: Item A ($1,450.00 x 3 = $4,350.00) + Tax @ 8.25% ($358.88) - Discount Code [SAVE-15%] ($652.50) = Net Payable: $4,056.38; Date: 2026-10-29.'
  },
  {
    id: 'num-2',
    category: 'numbers',
    difficulty: 'hard',
    title: 'Alphanumeric Key & Code Generator',
    content: 'UID: 9X7-482-B21 | SHA: a7f8-99e2-410c | IP: 192.168.1.104:8080 | PORT: 443 | KEY: [K$9#x@!2026]'
  }
];

export function getTextsByCategory(category: TextCategory, difficulty?: TextDifficulty): PracticeText[] {
  return PRACTICE_TEXTS.filter(t => {
    if (t.category !== category) return false;
    if (difficulty && t.difficulty !== difficulty) return false;
    return true;
  });
}

export function getRandomText(category?: TextCategory, difficulty?: TextDifficulty): PracticeText {
  let pool = PRACTICE_TEXTS;
  if (category) pool = pool.filter(t => t.category === category);
  if (difficulty) pool = pool.filter(t => t.difficulty === difficulty);
  if (pool.length === 0) pool = PRACTICE_TEXTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
