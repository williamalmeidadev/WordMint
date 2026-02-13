import { memo } from 'react';
import type { GameStatus } from '../game/types';
import type { GameStats } from '../storage/storage';

const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

type StatsPanelProps = {
  stats: GameStats;
  status: GameStatus;
  onShare: () => void;
  shareAvailable: boolean;
  showPlusOnLast: boolean;
  strings: {
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
  };
};

function StatsPanel({ stats, status, onShare, shareAvailable, showPlusOnLast, strings }: StatsPanelProps) {
  const winRate = stats.gamesPlayed ? stats.gamesWon / stats.gamesPlayed : 0;
  const maxDistribution = Math.max(1, ...stats.guessDistribution);

  return (
    <section className="panel grid gap-4 rounded-2xl border border-fog/10 bg-slate/60 px-4 py-5 sm:rounded-3xl sm:px-6 sm:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-fog/50">{strings.statistics}</p>
          <p className="text-base font-semibold sm:text-lg">{strings.progressSnapshot}</p>
        </div>
        {shareAvailable ? (
          <button
            type="button"
            onClick={onShare}
            className="control-pill w-full rounded-full bg-mint px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink sm:w-auto"
          >
            {strings.shareResult}
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-fog/10 bg-ink/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-fog/60">{strings.games}</p>
          <p className="text-2xl font-semibold">{stats.gamesPlayed}</p>
        </div>
        <div className="rounded-2xl border border-fog/10 bg-ink/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-fog/60">{strings.winRate}</p>
          <p className="text-2xl font-semibold">{formatPercentage(winRate)}</p>
        </div>
        <div className="rounded-2xl border border-fog/10 bg-ink/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-fog/60">{strings.currentStreak}</p>
          <p className="text-2xl font-semibold">{stats.currentStreak}</p>
        </div>
        <div className="rounded-2xl border border-fog/10 bg-ink/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-fog/60">{strings.maxStreak}</p>
          <p className="text-2xl font-semibold">{stats.maxStreak}</p>
        </div>
      </div>

      <div className="grid gap-3">
        <p className="text-xs uppercase tracking-[0.35em] text-fog/50">{strings.guessDistribution}</p>
        <div className="grid gap-2">
          {stats.guessDistribution.map((value, index) => {
            const isLast = index === stats.guessDistribution.length - 1;
            const label = showPlusOnLast && isLast ? `${index + 1}+` : `${index + 1}`;
            return (
            <div key={`guess-${index}`} className="flex items-center gap-3 text-sm">
              <span className="w-6 text-fog/60">{label}</span>
              <div className="h-2 flex-1 rounded-full bg-ink/70">
                <div
                  className="h-2 rounded-full bg-mint"
                  style={{ width: `${Math.round((value / maxDistribution) * 100)}%` }}
                />
              </div>
              <span className="w-6 text-right text-fog/60">{value}</span>
            </div>
          )})}
        </div>
        <p className="text-xs text-fog/60">
          {status === 'playing' ? strings.finishRound : strings.resultRecorded}
        </p>
      </div>
    </section>
  );
}

export default memo(StatsPanel);
