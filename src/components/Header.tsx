import { memo } from 'react';
import type { Language } from '../i18n';

type HeaderProps = {
  colorBlindMode: boolean;
  onToggleColorBlind: () => void;
  hardMode: boolean;
  onToggleHardMode: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  strings: {
    appName: string;
    heroTitle: string;
    heroSubtitle: string;
    preferences: string;
    themeToggle: (isLight: boolean) => string;
    hardModeToggle: (isOn: boolean) => string;
    colorBlindToggle: (isOn: boolean) => string;
    languageLabel: string;
    languageOption: (label: string) => string;
  };
};

function Header({
  colorBlindMode,
  onToggleColorBlind,
  hardMode,
  onToggleHardMode,
  theme,
  onToggleTheme,
  language,
  onLanguageChange,
  strings
}: HeaderProps) {
  const languageUi: Record<Language, { flag: string; short: string; label: string; next: Language }> = {
    pt: { flag: '🇧🇷', short: 'PT', label: 'Português', next: 'en' },
    en: { flag: '🇺🇸', short: 'EN', label: 'English', next: 'pt' }
  };
  const currentLanguage = languageUi[language];
  const nextLanguage = languageUi[currentLanguage.next];

  return (
    <header className="panel flex flex-col gap-5 rounded-2xl border border-fog/10 bg-slate/70 px-4 py-5 sm:gap-6 sm:rounded-3xl sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-mint">{strings.appName}</p>
          <h1 className="text-2xl font-semibold text-fog sm:text-3xl">{strings.heroTitle}</h1>
          <p className="max-w-xl text-sm text-fog/70 sm:text-base">{strings.heroSubtitle}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs uppercase tracking-[0.35em] text-fog/60">{strings.preferences}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onLanguageChange(currentLanguage.next)}
            className="control-pill flex items-center gap-2 rounded-full bg-ink/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-fog transition"
            aria-label={`${strings.languageLabel}: ${currentLanguage.label}. ${strings.languageOption(
              nextLanguage.label
            )}`}
            title={strings.languageOption(nextLanguage.label)}
          >
            <span aria-hidden="true">{currentLanguage.flag}</span>
            <span>{currentLanguage.short}</span>
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className={`control-pill rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
              theme === 'light' ? 'bg-fog text-ink' : 'bg-ink/60 text-fog'
            }`}
            aria-pressed={theme === 'light'}
          >
            {strings.themeToggle(theme === 'light')}
          </button>
          <button
            type="button"
            onClick={onToggleHardMode}
            className={`control-pill rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
              hardMode ? 'bg-mint text-ink' : 'bg-ink/60 text-fog'
            }`}
            aria-pressed={hardMode}
          >
            {strings.hardModeToggle(hardMode)}
          </button>
          <button
            type="button"
            onClick={onToggleColorBlind}
            className={`control-pill rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
              colorBlindMode ? 'bg-lemon text-ink' : 'bg-ink/60 text-fog'
            }`}
            aria-pressed={colorBlindMode}
          >
            {strings.colorBlindToggle(colorBlindMode)}
          </button>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
