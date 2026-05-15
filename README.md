# 🌟 PoppyLand

**PoppyLand** is a vibrant, highly polished, and kid-friendly educational web application designed to help toddlers and preschoolers (ages 2–6) learn the alphabet, numbers, and basic phonics. 

Built with modern web technologies, PoppyLand focuses heavily on **visual aesthetics, tactile UI interactions, and auditory feedback** to keep children engaged while they learn.

![PoppyLand Preview](public/og-image.png)

## ✨ Features

- 🎨 **Premium "Duolingo-style" UI**: 3D-pressed buttons, tactile hover states, and warm, vibrant color palettes built entirely with modern CSS (no heavy 3D libraries).
- ⭐ **Interactive Mascot (Poppy)**: A custom animated SVG star that blinks, speaks, sleeps, and reacts to the user's progress.
- 🎵 **Engaging Audio Engine**: Powered by Tone.js, featuring warm background music, satisfying pop/ding sound effects, and full Web Speech API integration to pronounce letters and words.
- 👆 **Custom Cursor System**: Replaces the default system cursor with smooth, hardware-accelerated SVG pointers (arrow and hand) that shrink and react to clicks.
- 🏆 **Sticker Collection**: A gamified progression system where children earn and collect cute stickers as they learn, complete with an animated progress bar.
- 📱 **Fully Responsive**: Carefully designed to work beautifully across mobile phones, tablets, and desktop computers.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Custom CSS Variables
- **Audio Synthesis**: [Tone.js](https://tonejs.github.io/)
- **Text-to-Speech**: Web Speech API
- **Icons & Graphics**: Pure CSS Art & optimized inline SVGs
- **Deployment**: Ready for [Vercel](https://vercel.com/)

## 🛠️ Getting Started

### Prerequisites

Make sure you have Node.js (v18+) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/krishsoni15/PoppyLand.git
   cd PoppyLand
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## 📁 Project Structure

- `/app` — Next.js 14 App Router pages and global CSS.
- `/components` — Reusable React components (UI, mascot, providers).
- `/hooks` — Custom React hooks (speech, audio, keyboard handling).
- `/lib` — Data constants, utility functions, and type definitions.
- `/public` — Static assets (fonts, icons, manifest).

## 🎮 How to Play

1. **Dashboard**: Enter your name to wake up Poppy the star!
2. **Learn ABC**: Tap letters to hear them pronounced ("A is for Apple"). Earn stickers for each letter!
3. **Learn 123**: Count numbers with visual aids.
4. **Stickers**: Check your collection progress on the dashboard.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for new games, better animations, or bug fixes, feel free to open an issue or submit a pull request.

## 📄 License

This project is open-source and free to use. Made with 💖 for kids!
