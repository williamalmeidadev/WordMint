import type { GameStatus, GuessEvaluation } from './types';
import { MAX_ATTEMPTS } from './constants';

const emojiMap = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
  empty: '⬛'
} as const;

type SharePayload = {
  status: GameStatus;
  evaluations: GuessEvaluation[];
};

export const buildShareText = ({ status, evaluations }: SharePayload) => {
  const attempts = status === 'won' ? evaluations.length : status === 'lost' ? 'X' : '-';
  const header = `WordMint Random ${attempts}/${MAX_ATTEMPTS}`;
  const grid = evaluations
    .map((evaluation) => evaluation.states.map((state) => emojiMap[state]).join(''))
    .join('\n');
  return `${header}\n${grid}`.trim();
};
