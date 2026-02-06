type MessageBannerProps = {
  message: string | null;
};

export default function MessageBanner({ message }: MessageBannerProps) {
  return (
    <div className="min-h-[2rem]" aria-live="polite" role="status">
      {message ? (
        <div className="inline-flex rounded-full bg-ink/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-fog">
          {message}
        </div>
      ) : null}
    </div>
  );
}
