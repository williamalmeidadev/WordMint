export default function App() {
  return (
    <main className="min-h-screen bg-ink text-fog">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.4em] text-mint">WordMint</p>
          <h1 className="text-4xl font-semibold">A clean daily word game, all in your browser.</h1>
          <p className="max-w-2xl text-base text-fog/80">
            The project is being assembled. Next step: game logic, state management, and the daily/practice
            modes.
          </p>
        </header>
        <section className="rounded-2xl border border-fog/10 bg-slate p-6">
          <p className="text-sm text-fog/70">Status</p>
          <p className="text-lg font-medium">Base UI scaffold is ready.</p>
        </section>
      </div>
    </main>
  );
}
