/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory persistent database store
interface UserRecord {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  coins: number;
  avatar: string;
}

interface TestResultRecord {
  id: string;
  userId: string;
  wpm: number;
  grossWpm: number;
  accuracy: number;
  cpm: number;
  timeSec: number;
  mode: string;
  textTitle: string;
  errors: number;
  createdAt: string;
}

const users: Record<string, UserRecord> = {
  default_user: {
    id: 'default_user',
    username: 'SpeedTypist',
    email: 'typist@typemaster.pro',
    xp: 240,
    level: 1,
    coins: 250,
    avatar: '⚡',
  },
};

const testResults: TestResultRecord[] = [
  {
    id: 'res_1',
    userId: 'default_user',
    wpm: 48,
    grossWpm: 50,
    accuracy: 98,
    cpm: 240,
    timeSec: 60,
    mode: '1 min test',
    textTitle: 'Top Common Words',
    errors: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const gameHighScores: Record<string, number> = {
  race: 65,
  wordrain: 850,
  zombie: 450,
  balloon: 22,
  scramble: 7,
  accuracy: 14,
  keyhunter: 48,
};

// ---------------- REST API ROUTES ----------------

// Auth routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, email } = req.body;
  const id = 'usr_' + Date.now();
  const newUser: UserRecord = {
    id,
    username: username || 'Typist',
    email: email || `${username}@typemaster.pro`,
    xp: 0,
    level: 1,
    coins: 100,
    avatar: '🚀',
  };
  users[id] = newUser;
  res.json({ token: 'mock-jwt-token-' + id, user: newUser });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  res.json({ token: 'mock-jwt-token', user: users['default_user'] });
});

app.get('/api/auth/me', (_req: Request, res: Response) => {
  res.json(users['default_user']);
});

// User settings & profile
app.put('/api/users/me', (req: Request, res: Response) => {
  const user = users['default_user'];
  if (req.body.username) user.username = req.body.username;
  if (req.body.avatar) user.avatar = req.body.avatar;
  res.json(user);
});

// Test Results with Anti-Cheat validation (e.g. WPM > 300 rejected)
app.post('/api/results', (req: Request, res: Response) => {
  const { wpm, grossWpm, accuracy, cpm, timeSec, mode, textTitle, errors } = req.body;

  // Anti-cheat rule
  if (wpm > 300) {
    res.status(400).json({ error: 'Unrealistic WPM score rejected by anti-cheat filter.' });
    return;
  }

  const record: TestResultRecord = {
    id: 'res_' + Date.now(),
    userId: 'default_user',
    wpm: Number(wpm) || 0,
    grossWpm: Number(grossWpm) || 0,
    accuracy: Number(accuracy) || 100,
    cpm: Number(cpm) || 0,
    timeSec: Number(timeSec) || 60,
    mode: mode || 'standard',
    textTitle: textTitle || 'Practice Text',
    errors: Number(errors) || 0,
    createdAt: new Date().toISOString(),
  };

  testResults.unshift(record);

  // Award XP
  const user = users['default_user'];
  const xpGained = Math.round((record.wpm * (record.accuracy / 100)) * 1.5);
  user.xp += xpGained;
  user.coins += Math.round(record.wpm / 4);

  res.json({ success: true, result: record, newXp: user.xp, newCoins: user.coins });
});

app.get('/api/results/me', (_req: Request, res: Response) => {
  res.json(testResults);
});

// Stats summary
app.get('/api/stats/summary', (_req: Request, res: Response) => {
  const total = testResults.length;
  const avgWpm = total > 0 ? Math.round(testResults.reduce((a, b) => a + b.wpm, 0) / total) : 0;
  const topWpm = total > 0 ? Math.max(...testResults.map(r => r.wpm)) : 0;
  const avgAcc = total > 0 ? Math.round((testResults.reduce((a, b) => a + b.accuracy, 0) / total) * 10) / 10 : 100;

  res.json({
    totalTests: total,
    averageWpm: avgWpm,
    topWpm,
    averageAccuracy: avgAcc,
    user: users['default_user'],
  });
});

// Games Highscores
app.post('/api/games/:gameId/score', (req: Request, res: Response) => {
  const { gameId } = req.params;
  const { score } = req.body;
  const current = gameHighScores[gameId] || 0;
  if (score > current) {
    gameHighScores[gameId] = score;
  }
  res.json({ success: true, gameId, highScore: gameHighScores[gameId] });
});

app.get('/api/games/:gameId/highscores', (req: Request, res: Response) => {
  const { gameId } = req.params;
  res.json({ gameId, highScore: gameHighScores[gameId] || 0 });
});

// Leaderboard
app.get('/api/leaderboard', (_req: Request, res: Response) => {
  res.json([
    { rank: 1, username: 'QuantumTyper', wpm: 142, accuracy: 99.4, country: 'US' },
    { rank: 2, username: 'SakuraSwift', wpm: 136, accuracy: 98.9, country: 'JP' },
    { rank: 3, username: 'ValkyrieKeys', wpm: 128, accuracy: 99.1, country: 'SE' },
    { rank: 4, username: 'NeonMatrix', wpm: 122, accuracy: 97.8, country: 'DE' },
    { rank: 5, username: 'SpeedTypist', wpm: 48, accuracy: 98.0, country: 'YOU' },
  ]);
});

// ---------------- VITE MIDDLEWARE INTEGRATION ----------------
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`TypeMaster Pro server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
