import type { GameMode, GameStatus, GuessEvaluation } from './types';
import { MAX_ATTEMPTS } from './constants';

const emojiMap = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
  empty: '⬛'
} as const;

type SharePayload = {
  mode: GameMode;
  dateKey: string;
  status: GameStatus;
  evaluations: GuessEvaluation[];
};

export const buildShareText = ({ mode, dateKey, status, evaluations }: SharePayload) => {
  const attempts = status === 'won' ? evaluations.length : status === 'lost' ? 'X' : '-';
  const header = `WordMint ${mode === 'daily' ? 'Daily' : 'Practice'} ${dateKey} ${attempts}/${MAX_ATTEMPTS}`;
  const grid = evaluations
    .map((evaluation) => evaluation.states.map((state) => emojiMap[state]).join(''))
    .join('\n');
  return `${header}\n${grid}`.trim();
};
