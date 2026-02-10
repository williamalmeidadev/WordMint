export type Language = 'pt' | 'en';

export const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' }
];

type Strings = {
  appName: string;
  heroTitle: string;
  heroSubtitle: string;
  preferences: string;
  themeToggle: (isLight: boolean) => string;
  hardModeToggle: (isOn: boolean) => string;
  colorBlindToggle: (isOn: boolean) => string;
  languageLabel: string;
  languageOption: (label: string) => string;
  randomMode: string;
  statusPlaying: string;
  statusWon: string;
  statusLost: string;
  newWord: string;
  notEnoughLetters: string;
  notInWordList: string;
  solvedIn: (attempts: number) => string;
  wordWas: (solution: string) => string;
  copiedToClipboard: string;
  clipboardUnavailable: string;
  statistics: string;
  progressSnapshot: string;
  shareResult: string;
  games: string;
  winRate: string;
  currentStreak: string;
  maxStreak: string;
  guessDistribution: string;
  finishRound: string;
  resultRecorded: string;
  guessBoard: string;
  onScreenKeyboard: string;
  enterKey: string;
  backspaceKey: string;
  tileAria: (row: number, col: number, state: string) => string;
  stateLabel: (state: string) => string;
  hardModePosition: (position: number, letter: string) => string;
  hardModeInclude: (count: number, letter: string) => string;
  shareHeader: (attempts: number | 'X' | '-', maxLabel: string) => string;
  attemptsRemaining: (remaining: number) => string;
  attemptsUsed: (used: number) => string;
  attemptsUnlimited: string;
};

export const STRINGS: Record<Language, Strings> = {
  pt: {
    appName: 'WordMint',
    heroTitle: 'Desafio de palavras aleatórias, feito para jogar offline.',
    heroSubtitle: 'Adivinhe a palavra de cinco letras em seis tentativas. Jogue quantas rodadas quiser.',
    preferences: 'Preferências',
    themeToggle: (isLight) => `Tema claro ${isLight ? 'ligado' : 'desligado'}`,
    hardModeToggle: (isOn) => `Modo difícil ${isOn ? 'ligado' : 'desligado'}`,
    colorBlindToggle: (isOn) => `Paleta daltônica ${isOn ? 'ligada' : 'desligada'}`,
    languageLabel: 'Idioma',
    languageOption: (label) => `Idioma ${label}`,
    randomMode: 'modo aleatório',
    statusPlaying: 'Faça sua próxima tentativa',
    statusWon: 'Muito bem!',
    statusLost: 'Boa sorte na próxima rodada',
    newWord: 'Nova palavra',
    notEnoughLetters: 'Faltam letras',
    notInWordList: 'Não está na lista de palavras',
    solvedIn: (attempts) => `Resolvido em ${attempts} ${attempts === 1 ? 'tentativa' : 'tentativas'}`,
    wordWas: (solution) => `A palavra era ${solution}`,
    copiedToClipboard: 'Copiado para a área de transferência',
    clipboardUnavailable: 'Área de transferência indisponível',
    statistics: 'Estatísticas',
    progressSnapshot: 'Resumo do progresso',
    shareResult: 'Compartilhar resultado',
    games: 'Jogos',
    winRate: 'Taxa de vitória',
    currentStreak: 'Sequência atual',
    maxStreak: 'Maior sequência',
    guessDistribution: 'Distribuição de tentativas',
    finishRound: 'Termine a rodada para atualizar as estatísticas.',
    resultRecorded: 'Resultado registrado nas estatísticas.',
    guessBoard: 'Tabuleiro de tentativas',
    onScreenKeyboard: 'Teclado na tela',
    enterKey: 'Enviar',
    backspaceKey: 'Apagar',
    tileAria: (row, col, state) => `Linha ${row} letra ${col} ${state}`,
    stateLabel: (state) => {
      if (state === 'correct') return 'correta';
      if (state === 'present') return 'presente';
      if (state === 'absent') return 'ausente';
      if (state === 'empty') return 'vazia';
      return state;
    },
    hardModePosition: (position, letter) => `Modo difícil: a posição ${position} deve ser ${letter}`,
    hardModeInclude: (count, letter) =>
      `Modo difícil: inclua pelo menos ${count} ${count === 1 ? 'letra' : 'letras'} '${letter}'`,
    shareHeader: (attempts, maxLabel) => `WordMint Aleatório ${attempts}/${maxLabel}`,
    attemptsRemaining: (remaining) =>
      remaining === 1 ? '1 tentativa restante' : `${remaining} tentativas restantes`,
    attemptsUsed: (used) => `${used} tentativas feitas`,
    attemptsUnlimited: 'Tentativas ilimitadas'
  },
  en: {
    appName: 'WordMint',
    heroTitle: 'Random word challenge, crafted offline.',
    heroSubtitle: 'Guess the five-letter word in six tries. Play as many random rounds as you like.',
    preferences: 'Preferences',
    themeToggle: (isLight) => `Light theme ${isLight ? 'on' : 'off'}`,
    hardModeToggle: (isOn) => `Hard mode ${isOn ? 'on' : 'off'}`,
    colorBlindToggle: (isOn) => `Color-blind palette ${isOn ? 'on' : 'off'}`,
    languageLabel: 'Language',
    languageOption: (label) => `Language ${label}`,
    randomMode: 'random mode',
    statusPlaying: 'Make your next guess',
    statusWon: 'Great work!',
    statusLost: 'Better luck next round',
    newWord: 'New word',
    notEnoughLetters: 'Not enough letters',
    notInWordList: 'Not in word list',
    solvedIn: (attempts) => `Solved in ${attempts} ${attempts === 1 ? 'try' : 'tries'}`,
    wordWas: (solution) => `The word was ${solution}`,
    copiedToClipboard: 'Copied to clipboard',
    clipboardUnavailable: 'Clipboard unavailable',
    statistics: 'Statistics',
    progressSnapshot: 'Progress snapshot',
    shareResult: 'Share result',
    games: 'Games',
    winRate: 'Win rate',
    currentStreak: 'Current streak',
    maxStreak: 'Max streak',
    guessDistribution: 'Guess distribution',
    finishRound: 'Finish the round to update stats.',
    resultRecorded: 'Result recorded in your stats.',
    guessBoard: 'Guess board',
    onScreenKeyboard: 'On screen keyboard',
    enterKey: 'Enter',
    backspaceKey: 'Back',
    tileAria: (row, col, state) => `Row ${row} letter ${col} ${state}`,
    stateLabel: (state) => state,
    hardModePosition: (position, letter) => `Hard mode: position ${position} must be ${letter}`,
    hardModeInclude: (count, letter) =>
      `Hard mode: include at least ${count} ${count === 1 ? `'${letter}'` : `'${letter}'s`}`,
    shareHeader: (attempts, maxLabel) => `WordMint Random ${attempts}/${maxLabel}`,
    attemptsRemaining: (remaining) => (remaining === 1 ? '1 attempt left' : `${remaining} attempts left`),
    attemptsUsed: (used) => `${used} attempts made`,
    attemptsUnlimited: 'Unlimited attempts'
  }
};

export const getStrings = (language: Language) => STRINGS[language];
