import { memo } from 'react';
import type { GameStatus } from '../game/types';
import type { GameStats } from '../storage/storage';

const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

type StatsPanelProps = {
  stats: GameStats;
  status: GameStatus;
  onShare: () => void;
  shareAvailable: boolean;
};

function StatsPanel({ stats, status, onShare, shareAvailable }: StatsPanelProps) {
  const winRate = stats.gamesPlayed ? stats.gamesWon / stats.gamesPlayed : 0;

  return (
    <section className="panel grid gap-4 rounded-2xl border border-fog/10 bg-slate/60 px-4 py-5 sm:rounded-3xl sm:px-6 sm:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-fog/50">Statistics</p>
          <p className="text-base font-semibold sm:text-lg">Progress snapshot</p>
        </div>
        {shareAvailable ? (
          <button
            type="button"
            onClick={onShare}
            className="control-pill w-full rounded-full bg-mint px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink sm:w-auto"
          >
            Share result
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-fog/10 bg-ink/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-fog/60">Games</p>
          <p className="text-2xl font-semibold">{stats.gamesPlayed}</p>
        </div>
        <div className="rounded-2xl border border-fog/10 bg-ink/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-fog/60">Win rate</p>
          <p className="text-2xl font-semibold">{formatPercentage(winRate)}</p>
        </div>
        <div className="rounded-2xl border border-fog/10 bg-ink/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-fog/60">Current streak</p>
          <p className="text-2xl font-semibold">{stats.currentStreak}</p>
        </div>
        <div className="rounded-2xl border border-fog/10 bg-ink/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-fog/60">Max streak</p>
          <p className="text-2xl font-semibold">{stats.maxStreak}</p>
        </div>
      </div>

      <div className="grid gap-3">
        <p className="text-xs uppercase tracking-[0.35em] text-fog/50">Guess distribution</p>
        <div className="grid gap-2">
          {stats.guessDistribution.map((value, index) => (
            <div key={`guess-${index}`} className="flex items-center gap-3 text-sm">
              <span className="w-6 text-fog/60">{index + 1}</span>
              <div className="h-2 flex-1 rounded-full bg-ink/70">
                <div
                  className="h-2 rounded-full bg-mint"
                  style={{ width: `${Math.min(value * 12, 100)}%` }}
                />
              </div>
              <span className="w-6 text-right text-fog/60">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-fog/60">
          {status === 'playing'
            ? 'Finish the round to update stats.'
            : 'Result recorded in your stats.'}
        </p>
      </div>
    </section>
  );
}

export default memo(StatsPanel);
