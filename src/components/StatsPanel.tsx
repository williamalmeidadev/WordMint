import type { GameMode, GameStatus } from '../game/types';
import type { GameStats } from '../storage/storage';

const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

type StatsPanelProps = {
  stats: GameStats;
  mode: GameMode;
  status: GameStatus;
  attempts: number;
  onShare: () => void;
  shareAvailable: boolean;
};

export default function StatsPanel({ stats, mode, status, attempts, onShare, shareAvailable }: StatsPanelProps) {
  const winRate = stats.gamesPlayed ? stats.gamesWon / stats.gamesPlayed : 0;

  return (
    <section className="grid gap-4 rounded-3xl border border-fog/10 bg-slate/60 px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-fog/50">Statistics</p>
          <p className="text-lg font-semibold">Progress snapshot</p>
        </div>
        {shareAvailable ? (
          <button
            type="button"
            onClick={onShare}
            className="rounded-full bg-mint px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink"
          >
            Share result
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
          {mode === 'daily'
            ? status === 'playing'
              ? 'Finish the daily puzzle to update stats.'
              : `Daily result recorded in ${attempts || 'X'} attempts.`
            : 'Practice rounds are included in your overall stats.'}
        </p>
      </div>
    </section>
  );
}
