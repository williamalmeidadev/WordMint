type HeaderProps = {
  colorBlindMode: boolean;
  onToggleColorBlind: () => void;
};

export default function Header({ colorBlindMode, onToggleColorBlind }: HeaderProps) {
  return (
    <header className="flex flex-col gap-6 rounded-3xl border border-fog/10 bg-slate/70 px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-mint">WordMint</p>
          <h1 className="text-3xl font-semibold text-fog">Random word challenge, crafted offline.</h1>
          <p className="max-w-xl text-sm text-fog/70">
            Guess the five-letter word in six tries. Play as many random rounds as you like.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.35em] text-fog/60">Accessibility</p>
        <button
          type="button"
          onClick={onToggleColorBlind}
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
            colorBlindMode ? 'bg-lemon text-ink' : 'bg-ink/60 text-fog'
          }`}
          aria-pressed={colorBlindMode}
        >
          Color-blind palette {colorBlindMode ? 'on' : 'off'}
        </button>
      </div>
    </header>
  );
}
