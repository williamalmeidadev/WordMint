export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export type GuessEvaluation = {
  letters: string[];
  states: LetterState[];
};

export type GameStatus = 'playing' | 'won' | 'lost';
