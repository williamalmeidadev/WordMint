# WordMint

WordMint is a browser-based word guessing game inspired by classic five-letter puzzles. It runs entirely on the client side with random word selection, offline play, and persistent stats.

## Highlights
- Random word mode for unlimited offline play
- Accessible UI with keyboard support and color-blind palette toggle
- Local storage persistence for progress, stats, and settings
- Shareable emoji grid results without revealing the word

## Tech Stack
- Vite
- React + TypeScript
- Tailwind CSS
- State management with `useReducer`
- Persistence via `localStorage`

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

## Word Selection
Each round uses a random word from the curated list, fully offline.

## Persistence
Stored under these `localStorage` keys:
- `wordmint-stats` - win rate, streaks, distribution
- `wordmint-settings` - user preferences (color-blind mode)

## Deployment (GitHub Pages)
This project is prepped for GitHub Pages with a workflow in `.github/workflows/deploy.yml`.

Steps:
1. Ensure the repository is named `WordMint` (or update `base` in `vite.config.ts` to `/<repo-name>/`).
2. Push to the `main` branch.
3. In GitHub, enable Pages for the repository and set the source to `GitHub Actions`.

The build output is `dist/` and is deployed automatically on pushes to `main`.

## Roadmap
- Expand the English word list
- Add onboarding / help modal
- Add animation polish
