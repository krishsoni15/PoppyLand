# LetterPop 🌈

**Every letter is an adventure!**

LetterPop is a free, kid-friendly web app for learning the **alphabet (A–Z)** and **numbers (1–20)**. It uses your browser’s built-in voice, synthesized sounds (no audio files to download), colorful UI, and simple games. Built for ages **2–6**.

---

## Table of contents

1. [Quick start](#quick-start)
2. [App overview](#app-overview)
3. [Pages & features](#pages--features)
4. [Keyboard shortcuts](#keyboard-shortcuts)
5. [UI & design system](#ui--design-system)
6. [Sound & voice](#sound--voice)
7. [How the game works](#how-the-game-works)
8. [Tech stack](#tech-stack)
9. [Project structure](#project-structure)
10. [Scripts](#scripts)
11. [Deploy to Vercel](#deploy-to-vercel)
12. [Accessibility](#accessibility)

---

## Quick start

```bash
# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build
npm run build
npm start

# Type check
npm run type-check
```

**Note:** Speech and music need one click/tap first (browser autoplay rules). Use the 🔊 mute button in the nav if you want silence.

---

## App overview

| Route       | What it does                                      |
|------------|---------------------------------------------------|
| `/`        | Home — pick ABC, Numbers, or Game                 |
| `/alphabet`| Learn letters A–Z with words, emojis, voice       |
| `/numbers` | Learn numbers 1–20 with counting emojis & notes   |
| `/game`    | Quiz — find the right letter or number (10 rounds)|

```
┌─────────────┐
│    HOME     │
│  LetterPop  │
└──────┬──────┘
       │
   ┌───┼───┐
   ▼   ▼   ▼
 ABC  123 Game
```

---

## Pages & features

### Home (`/`)

- Big rainbow title and tagline
- Three large gradient buttons: **Learn ABC**, **Learn 123**, **Play Game**
- Floating star/balloon decorations
- Keyboard: press `1`, `2`, or `3` to jump to each section

### Alphabet (`/alphabet`)

**What kids do:** Tap a letter (or press a key) to hear it and see a word + emoji.

| Feature | Details |
|--------|---------|
| **Big display** | Current letter shown large in a glowing glass card |
| **Letter grid** | All 26 letters as colorful 3D buttons (rainbow colors) |
| **Word card** | e.g. “A is for Apple” + 🍎 |
| **Voice** | Says the letter, then “A is for Apple” |
| **Sound** | Happy “ding” (Tone.js) on each pick |
| **Prev / Next** | Step through letters one at a time |
| **Auto Play** | Cycles A→Z every ~2.5s with speech |
| **Progress bar** | Shows auto-play position |

**Letter → word → emoji (full list):**

| Letter | Word | Emoji |
|--------|------|-------|
| A | Apple | 🍎 |
| B | Ball | 🏀 |
| C | Cat | 🐱 |
| D | Dog | 🐶 |
| E | Elephant | 🐘 |
| F | Fish | 🐟 |
| G | Grapes | 🍇 |
| H | Hat | 🎩 |
| I | Ice Cream | 🍦 |
| J | Juice | 🧃 |
| K | Kite | 🪁 |
| L | Lion | 🦁 |
| M | Moon | 🌙 |
| N | Nest | 🪺 |
| O | Orange | 🍊 |
| P | Penguin | 🐧 |
| Q | Queen | 👑 |
| R | Rainbow | 🌈 |
| S | Star | ⭐ |
| T | Tiger | 🐯 |
| U | Umbrella | ☂️ |
| V | Violin | 🎻 |
| W | Watermelon | 🍉 |
| X | Xylophone | 🎵 |
| Y | Yarn | 🧶 |
| Z | Zebra | 🦓 |

### Numbers (`/numbers`)

Same layout as alphabet, for **1–20**.

| Feature | Details |
|--------|---------|
| **Big display** | Current number in blue-themed stage |
| **Number grid** | 20 colorful tiles |
| **Word card** | Word + repeated emojis (e.g. 🎈🎈🎈 for Three) |
| **Voice** | “Number Three!” then the word |
| **Sound** | Musical note from C major scale (different pitch per number) |
| **Auto Play** | Cycles 1→20 |
| **Keyboard** | Keys `1`–`9`, `0` = ten; `11`–`20` via arrows or taps |

**Examples:**

| # | Word | Visual |
|---|------|--------|
| 1 | One | ☀️ |
| 3 | Three | 🎈🎈🎈 |
| 5 | Five | 🌸🌸🌸🌸🌸 |
| 10 | Ten | 🎉×10 |
| 20 | Twenty | 🏆×20 |

(Full data lives in `lib/data.ts`.)

### Game (`/game`)

**“Find the letter / number!”** quiz.

| Feature | Details |
|--------|---------|
| **Two modes** | **ABC** (letters) or **123** (numbers 1–10) |
| **Question** | “Find the letter… **A**!” with target shown big |
| **4 choices** | 1 correct + 3 random wrong (shuffled) |
| **Correct** | Confetti, success chord, praise voice, score +1, next question |
| **Wrong** | Shake animation, gentle low tone, “Try again!”, retry same question |
| **Score** | ⭐ stars — 10 questions per round |
| **Finish** | “You’re a Superstar!” + final score + Play Again / Home |

**Flow:**

```
Start → Question 1 of 10
  → Kid picks answer
    → Correct? → confetti + sound → next question
    → Wrong?   → shake + retry (same question)
  → After 10 → results screen
```

---

## Keyboard shortcuts

Works on every screen (ignored when typing in an input).

| Screen | Keys |
|--------|------|
| **Home** | `1` → Alphabet · `2` → Numbers · `3` → Game |
| **Alphabet** | `A`–`Z` select letter · `←` `→` prev/next · `Space` or `Enter` toggle auto-play |
| **Numbers** | `1`–`9` select number · `0` = 10 · `←` `→` · `Space` auto-play |
| **Game** | Type the **answer** (letter or digit) **or** `1`–`4` to pick the matching choice button |

A **⌨️ Keyboard** hint bar at the bottom of each screen lists shortcuts.

---

## UI & design system

### Goals

- **Big & chunky** — easy for small hands and eyes  
- **Bright & happy** — rainbow palette, no dull grays on main actions  
- **One focus at a time** — big hero letter/number, then grid, then word card  
- **Feels premium** — glass cards, soft blobs, 3D buttons (not flat/cheap)

### Fonts

| Use | Font |
|-----|------|
| Headings, letters, buttons | **Fredoka** (Google Font via `next/font`) |
| Body, hints | **Nunito** (400, 700, 900) |

### Colors (brand)

| Token | Hex | Use |
|-------|-----|-----|
| Red | `#FF6B6B` | A, accents |
| Orange | `#FF9F43` | B, warm gradients |
| Yellow | `#FECA57` | C, highlights |
| Green | `#6BCB77` | D, success |
| Teal | `#4ECDC4` | E, numbers mode |
| Blue | `#4D96FF` | F, focus rings |
| Purple | `#A855F7` | Game, auto-play |
| Pink | `#FF6BB5` | H, gradients |
| Background | `#FFF9F0` | Page base |

### Layout pieces

| Component | Role |
|-----------|------|
| `PageShell` | Full-page gradient + animated color blobs |
| `NavBar` | Home link + title + 🔊 mute |
| `BigDisplay` | Glowing glass stage for hero letter/number |
| `WordCard` | Word + bouncing emoji |
| `LetterCard` | 3D tile in grid (optional hotkey badge) |
| `KeyboardHint` | Shortcut chips |
| `ProgressBar` | Auto-play progress |
| `ScoreBoard` | Game score pill |
| `GameQuestion` | Mission card + shimmer target |
| `GameBoard` | 2×2 choice grid with `1`–`4` badges |
| `GameResult` | End screen with trophy/star and gradients |
| `FloatingStars` | Home decoration (stars, balloons, rainbow) |

### CSS utilities (`app/globals.css`)

| Class | Effect |
|-------|--------|
| `card-glass` | Frosted white card + soft shadow |
| `btn-3d` | Press-down button depth |
| `display-stage` | Pulsing glow on big letter |
| `text-shimmer` | Animated rainbow gradient text |
| `emoji-bounce` | Gentle bounce on emojis |
| `blob` | Blurred background orbs |
| `animate-pop` / `shake` / `float` / `zoom-in` | Motion (respects `prefers-reduced-motion`) |

### Page themes

| Page | `PageShell` variant | Vibe |
|------|---------------------|------|
| Home | `home` | Warm cream → soft purple |
| Alphabet | `warm` | Peach / pink |
| Numbers | `cool` | Sky blue / lavender |
| Game | `play` | Purple / pink play mode |

---

## Sound & voice

### Voice — Web Speech API (`lib/speech.ts`, `hooks/useSpeech.ts`)

- No API keys, no downloads  
- Slower rate (~0.78) and slightly higher pitch for kids  
- Prefers friendly system voices (e.g. Samantha, Karen) when available  
- Cancels previous speech when a new line starts  

### Music & SFX — Tone.js (`lib/sounds.ts`)

Loaded **only after first interaction** (dynamic `import('tone')`) to keep the app fast.

| Function | When |
|----------|------|
| `playDing()` | Letter selected on alphabet |
| `playNumberNote(n)` | Number selected (scale note 1–20) |
| `playSuccess()` | Correct game answer (chord) |
| `playWrong()` | Wrong game answer (low tone) |

Mute is global via `SoundProvider` — nav 🔊/🔇 toggles all Tone sounds.

### Celebration — canvas-confetti (`lib/confetti.ts`)

- Double burst on correct game answers  
- Loaded dynamically (not on first paint)  

---

## How the game works

**State machine** (`hooks/useGame.ts`):

| Phase | Meaning |
|-------|---------|
| `playing` | Waiting for answer |
| `answered-correct` | Right — show feedback, then `next()` |
| `answered-wrong` | Wrong — feedback, then `retry()` (same question) |
| `finished` | 10 questions done — results screen |

**Choice generation** (`lib/game-utils.ts`):

- Fisher–Yates shuffle  
- 1 correct + 3 random wrong from full alphabet (or numbers 1–10)  
- Choices reshuffled each question  

**Letter mode:** pool of 10 shuffled letters from A–Z.  
**Number mode:** pool of 10 shuffled numbers from 1–10.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 16** (App Router) |
| Language | **TypeScript** |
| UI | **React 19** |
| Styling | **Tailwind CSS v4** |
| Fonts | `next/font` (Fredoka, Nunito) |
| Sounds | **Tone.js** (synthesized) |
| Voice | **Web Speech API** |
| Confetti | **canvas-confetti** |
| Analytics | **@vercel/analytics** (optional on Vercel) |
| Hosting | **Vercel** (recommended) |

**No** external audio files. **No** paid APIs. **No** env vars required for core features.

---

## Project structure

```
letterpop/
├── app/
│   ├── layout.tsx          # Fonts, metadata, SEO, JSON-LD, Analytics
│   ├── page.tsx            # Home (client — keyboard nav)
│   ├── globals.css         # Tokens, animations, glass/3D utilities
│   ├── icon.tsx            # Generated app icon (PNG)
│   ├── sitemap.ts          # SEO sitemap
│   ├── robots.ts           # robots.txt
│   ├── alphabet/           # Alphabet route + loading skeleton
│   ├── numbers/            # Numbers route + loading skeleton
│   └── game/               # Game route + loading skeleton
│
├── components/
│   ├── alphabet/AlphabetScreen.tsx
│   ├── numbers/NumbersScreen.tsx
│   ├── game/GameScreen.tsx, GameBoard.tsx, GameQuestion.tsx, GameResult.tsx
│   ├── home/FloatingStars.tsx
│   ├── providers/SoundProvider.tsx   # Mute + sound API
│   └── ui/                           # Reusable UI (NavBar, cards, etc.)
│
├── hooks/
│   ├── useKeyboard.ts      # Global keydown handler
│   ├── useSpeech.ts        # Speech synthesis hook
│   ├── useAutoPlay.ts      # A→Z / 1→20 timer loop
│   └── useGame.ts          # Quiz state machine
│
├── lib/
│   ├── data.ts             # ALPHABET_DATA, NUMBERS_DATA
│   ├── sounds.ts           # Tone.js helpers
│   ├── speech.ts           # speak / stop
│   ├── confetti.ts         # Celebration bursts
│   ├── game-utils.ts       # Shuffle & choice generation
│   └── constants.ts        # App name, URLs, intervals
│
├── public/
│   └── manifest.json       # PWA manifest
│
├── next.config.ts          # Security headers
├── package.json
└── README.md               # This file
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint |
| `npm run type-check` | `tsc --noEmit` |

---

## Deploy to Vercel

1. Push this repo to GitHub  
2. Go to [vercel.com](https://vercel.com) → **New Project** → import repo  
3. Click **Deploy** (defaults work; no env vars needed)  
4. Optional: set custom domain (e.g. `letterpop.app`) and update `SITE_URL` in `lib/constants.ts` for canonical URLs in metadata  

SEO included: Open Graph, Twitter card, `sitemap.xml`, `robots.txt`, JSON-LD `WebApplication` schema.

---

## Accessibility

- Large touch targets (min ~44px; main buttons ~80px+)  
- `aria-label` on interactive controls  
- `aria-pressed` on toggles and letter tiles  
- `aria-live` on score and big display  
- Emoji marked `aria-hidden` where text repeats the meaning  
- Visible `focus-visible` rings  
- `lang="en"` on `<html>`  
- Animations toned down when `prefers-reduced-motion: reduce`  
- Keyboard navigation on all main screens  

---

## Configuration

| File | What to change |
|------|----------------|
| `lib/constants.ts` | `SITE_URL`, `AUTO_PLAY_INTERVAL_MS`, `GAME_TOTAL_QUESTIONS` |
| `lib/data.ts` | Letter words/emojis, number objects |
| `public/manifest.json` | PWA name, colors, icons |
| `app/layout.tsx` | Site metadata, title template |

---

## License & audience

Free educational app for young children. No ads in the codebase. Parental supervision recommended for browser permissions (audio/speech).

---

**LetterPop** · Learn ABC & 123 · Tap, type, listen, play 🌟
# PoppyLand
