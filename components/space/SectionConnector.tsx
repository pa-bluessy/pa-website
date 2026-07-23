export function SectionConnector({ label = "SIGNAL LINK" }: { label?: string }) {
  return (
    <div className="relative mx-auto flex max-w-6xl items-center gap-4 px-5 md:px-8" aria-hidden>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pa-border to-transparent" />
      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-pa-cyan/70 motion-safe:animate-orbit-pulse" />
        </span>
        <span className="coord-label">{label}</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pa-border to-transparent" />
    </div>
  );
}
