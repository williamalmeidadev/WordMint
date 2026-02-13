import type { GameStatus, GuessEvaluation } from './types';

const emojiMap = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
  empty: '⬛'
} as const;

type SharePayload = {
  status: GameStatus;
  evaluations: GuessEvaluation[];
  header: (attempts: number | 'X' | '-') => string;
};

export const buildShareText = ({ status, evaluations, header }: SharePayload) => {
  const attempts = status === 'won' ? evaluations.length : status === 'lost' ? 'X' : '-';
  const shareHeader = header(attempts);
  const grid = evaluations
    .map((evaluation) => evaluation.states.map((state) => emojiMap[state]).join(''))
    .join('\n');
  return `${shareHeader}\n${grid}`.trim();
};
