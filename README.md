# WordMint

WordMint is a browser-based word guessing game inspired by classic five-letter puzzles. It runs entirely on the client side with deterministic daily logic, offline practice mode, and persistent stats.

## Highlights
- Daily mode with a deterministic word (same for everyone each day)
- Practice mode for unlimited offline play
- Accessible UI with keyboard support and color-blind palette toggle
- Local storage persistence for progress, stats, and settings
- Shareable emoji grid results without revealing the word

## Tech Stack
- Vite
- React + TypeScript
- Tailwind CSS
- State management with `useReducer`
- Persistence via `localStorage`
- Testing with Vitest

## Getting Started
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - lint the codebase
- `npm run format` - check formatting
- `npm run test` - run tests

## Daily Word Logic
The daily word is calculated using a fixed UTC reference date. The app computes the number of days since that reference and uses modulo against the word list length to pick a deterministic word. This keeps the daily puzzle consistent for all users, fully offline.

## Persistence
Stored under these `localStorage` keys:
- `wordmint-daily` - daily game state
- `wordmint-stats` - win rate, streaks, distribution
- `wordmint-settings` - user preferences (color-blind mode)

## Deployment (GitHub Pages)
The app is fully static and uses `base: "/"` in `vite.config.ts`. Build output is in `dist/` and can be deployed to GitHub Pages via any static hosting workflow.

## Roadmap
- Expand the English word list
- Add onboarding / help modal
- Add animation polish
