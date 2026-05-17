# 🌟 PoppyLand (LetterPop)

**PoppyLand** is a vibrant, highly polished, and kid-friendly educational web application designed to help toddlers and preschoolers (ages 2–6) learn the alphabet, numbers, and basic phonics. It uses an incredibly rich, tactile interface and gamified elements to keep children engaged while they learn.

Built with modern web technologies, PoppyLand focuses heavily on **visual aesthetics, dynamic environments, tactile UI interactions, and interactive auditory feedback**.

![PoppyLand Preview](public/og-image.png)

---

## ✨ Full Feature List & Properties

### 🎮 Learning Modules (Pages & Screens)
* **Dashboard (`/`)**: The main hub. Enter your name to wake up Poppy the star! Displays your current XP, Level, Daily Streak, and offers access to all minigames.
* **Alphabet (`/alphabet`)**: Interactive A-Z flashcards. Tap letters to hear them pronounced ("A is for Apple 🍎"). Includes letter colors, words, and emojis.
* **Numbers (`/numbers`)**: Counting practice from 1 to 20 with visual emoji aids (e.g., 3 balloons 🎈🎈🎈) and TTS voice readout.
* **Trace Valley (`/trace`)**: Mobile-first handwriting playground — pre-writing lines & shapes, A–Z letters, lowercase a–c, and 0–9 numbers. React Konva canvas with ghost paths, voice guidance, stars, XP, and unlock progression.
* **Game (`/game`)**: A quiz/game board to test the child's knowledge of what they've learned.
* **Speak (`/speak`)**: Speech practice using the Web Speech API to encourage kids to pronounce words out loud.
* **Bubbles (`/bubbles`)**: A satisfying pop-the-bubble minigame for casual play and hand-eye coordination.
* **My Name (`/myname`)**: A personalized module where kids learn how to spell and recognize their own name.
* **Profile (`/profile`)**: Displays user stats, including XP progression and current level.
* **Collection (`/collection`)**: A sticker book where kids view the digital stickers they've unlocked through learning.

### 🦉 Interactive Mascot (Poppy the Star)
* **Global Mascot (`MascotBridge.tsx` & `TalkingPoppy.tsx`)**: A custom animated SVG star mascot that follows the user across the app.
* **Reactivity**: Poppy blinks, sleeps when the user is idle, wakes up when they type their name, and physically reacts to the child's progress.

### 🌙 Dynamic Atmospheres & Night Mode
* **Time-of-Day System**: Features an immersive "Night Mode" with a global `isNightMode` state.
* **Animated Backgrounds (`AnimatedBackground.tsx`)**: Beautifully smooth CSS gradient transitions between Day (bright, warm colors) and Night (deep blues/purples).
* **Floating Stars (`FloatingStars.tsx`)**: Twinkling, animated background stars that appear at night.
* **Atmospheric Sync**: The background music and UI elements automatically adjust to match the time of day, offering a cozy, calming environment in the evening.

### 🎵 Custom Audio Engine
* **Tone.js Integration (`SoundProvider.tsx`)**: Real-time synthesized, warm background music that adapts to the mood.
* **Sound Effects**: Highly satisfying UI sounds (pops, dings, swooshes, success chimes) tied to clicks, leveling up, and earning rewards.
* **Text-to-Speech (TTS)**: Full Web Speech API integration that speaks letters, numbers, and words clearly.

### 🏆 Gamification & Rewards Engine
* **XP & Leveling System**: Kids earn XP for every action. Features animated XP bars (`XpBar.tsx`) and dynamic Level Up overlays (`LevelUpOverlay.tsx`).
* **Daily Streaks & Stamps**: Encourages daily learning habits with visual Daily Stamps (`DailyStamps.tsx`) and a Streak Banner (`StreakBanner.tsx`).
* **Sticker Collection**: A progression system where kids unlock digital stickers.
* **Dopamine Hooks (`useDopamine.ts`)**: Special animations, confetti bursts (`Canvas Confetti`), and screen flashes (`ScreenFlash.tsx`) to reward correct answers and maintain high engagement.

### 💅 Premium UI / UX Details
* **"Duolingo-style" Tactile UI**: 3D-pressed buttons and tactile hover states built with modern CSS and Tailwind (no heavy 3D DOM bloat).
* **Custom Cursor System (`CustomCursor.tsx` & `CursorTrail.tsx`)**: Replaces the default system cursor with smooth, hardware-accelerated SVG pointers (arrow and hand) that shrink, click, and leave a trail.
* **CSS Art (`CssArt.tsx`)**: Lightweight, beautifully rendered CSS illustrations.
* **Keyboard Navigation**: Hints and overlays (`KeyboardHint.tsx`) to help kids and parents navigate without a mouse.
* **Toast Notifications**: Child-friendly toast notifications for achievements.

---

## 🚀 Tech Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
* **Language**: TypeScript
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Custom CSS Variables
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **3D & Physics**: [Three.js](https://threejs.org/), `@react-three/fiber`, `@react-three/drei`
* **Audio Synthesis**: [Tone.js](https://tonejs.github.io/)
* **Voice**: Web Speech API
* **Effects**: Canvas Confetti
* **Handwriting Canvas**: React Konva (touch tracing)
* **Icons**: `lucide-react`
* **Deployment**: Optimized for Vercel with Analytics (`@vercel/analytics`)

---

## 🐛 Known Quirks & Limitations (Bugs & "Gotchas")

While highly polished, there are a few browser-specific quirks related to the web APIs used:
1. **Audio Context Autoplay Policy**: Browsers block background audio and speech synthesis until the user interacts with the page (a click or tap). The dashboard requires a name entry/click to "Wake up Poppy", which safely unlocks the AudioContext.
2. **Web Speech API Consistency**: Different devices/browsers (Safari vs Chrome) have different TTS voice engines, meaning the accent or voice tone of Poppy may vary slightly depending on the OS.
3. **Local Storage Limits**: Progress, XP, and stickers are saved in the browser's `localStorage` via custom hooks (`lib/storage.ts`). If the user clears their browser cache, or uses incognito mode, their progress will be lost. 

---

## 🛠️ Getting Started (Local Development)

### Prerequisites
Make sure you have Node.js (v18+) installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/krishsoni15/PoppyLand.git
   cd PoppyLand
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Play:**
   Open your browser and navigate to `http://localhost:3000`.

---

## 📁 Project Structure Highlights

* `/app` — Next.js 14 App Router layout, pages (modules like `/alphabet`, `/game`, `/trace`), and global CSS.
* `/components` — The heart of the UI.
  * `/components/ui/` - Buttons, NavBars, Cursors, Toast, Modals, Progress bars.
  * `/components/mascot/` - Poppy the Star SVG components and state bridges.
  * `/components/home/` - Animated backgrounds and floating stars.
* `/hooks` — Core logic: `useGame`, `useAutoPlay`, `useSpeech`, `useDopamine` (rewards), `useKeyboard`.
* `/lib` — Data constants (`ALPHABET_DATA`, `NUMBERS_DATA`), game logic, streak management, audio maps.

## 📄 License

This project is open-source and free to use. Made with 💖 for kids!
