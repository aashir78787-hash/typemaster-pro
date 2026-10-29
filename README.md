# TypeMaster Pro ⚡ (React + Spring Boot)

> A modern, gamified touch-typing academy web application inspired by classic Typing Master, featuring real-time telemetry, 40+ structured lessons, interactive virtual keyboard with color-coded finger zones, 7 arcade typing games, AI & multiplayer racing, and downloadable verified certificates.

---

## 🌟 Key Features

1. **High-Performance Typing Engine**
   - Zero input lag using mutable tracking refs.
   - Real-time character highlighting (correct: emerald, error: rose with underline, cursor: pulsing caret).
   - Live Net WPM, Gross WPM, Accuracy %, CPM, and error count.
   - Built-in Web Audio API sound synthesizer with mechanical switch, typewriter, membrane, and cyber sound themes.
   - Backspace handling with optional "Stop on Error" strict mode.

2. **40+ Structured Lessons (5 Progressive Levels)**
   - **Level 1**: Home Row Fundamentals (Anchor keys F & J, D & K, S & L, A & ;, G & H)
   - **Level 2**: Top Row Mastery (R & U, E & I, W & O, Q & P, T & Y)
   - **Level 3**: Bottom Row Mastery (V & M, C & Comma, X & Period, Z & Slash, B & N)
   - **Level 4**: Numbers & Symbols (!@#$%^&*()[]{}:")
   - **Level 5**: Speed, Code & Prose (JavaScript, Python, High Velocity Sprints, Grandmaster Exam)
   - 1-3 Stars rating per lesson, sequential unlock progression.
   - Visual Hand Guide showing which finger to use for each key.

3. **7 Arcade Typing Games**
   - **Typing Race Grand Prix**: Top-down track with animated cars, Solo vs AI Bots (Slow Bob, Swift Sarah, Nitro Neo, Cyber Beast) & Multiplayer Room mode, podium celebration, and car skin shop.
   - **Falling Words (Word Rain)**: Shoot raining words before they hit the ground.
   - **Balloon Pop**: Float-up balloon popping with timed rounds.
   - **Zombie Defense**: Barricade survival against marching zombie waves and boss encounters.
   - **Word Scramble / Speed Spell**: Anagram unscrambling against rapid timer.
   - **Accuracy Challenge**: Sudden death mode — 1 mistake equals immediate game over.
   - **Key Hunter**: Big letter reflex and muscle memory trainer for beginners.

4. **Analytics & Diagnostics**
   - Real-time WPM progression SVG chart with velocity trends.
   - Weak Keys Heatmap diagnosing high-error keys with a 1-click "Launch Targeted Drill".
   - GitHub-style 12-week streak activity heatmap.
   - Official downloadable / printable verified achievement certificate with gold seal.
   - 28 Gamification Badges with XP rewards, level progression, and confetti animations.

---

## 🚀 Running the Project

### 1. React Web Application (Vite + Express Server)
```bash
# Install dependencies
npm install

# Run the dev server on port 3000
npm run dev

# Run unit tests
npx tsx --test src/utils/typingMath.test.ts

# Build production bundle
npm run build
```

### 2. Spring Boot Backend (Optional standalone Java service)
The backend directory contains the complete Spring Boot 3 + Java 17 service with JPA, H2/PostgreSQL, WebSocket, and Swagger UI.

```bash
cd backend

# Run with Maven
./mvnw clean spring-boot:run

# Run JUnit 5 tests
./mvnw test
```
- API Base URL: `http://localhost:8080/api`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
- H2 Database Console: `http://localhost:8080/h2-console`

---

## 🔒 Anti-Cheat & Quality Assurance
- Backend enforces `< 300 WPM` ceiling to filter automated macro bots.
- Client persists state in `localStorage` with offline fallback if the backend is unreachable.
- Zero external audio files — 100% synthesized procedural Web Audio for instantaneous response.
