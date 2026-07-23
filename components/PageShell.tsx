import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Narrow letter column (default) or wider product layout */
  width?: "letter" | "wide";
  className?: string;
};

/**
 * Inner-page shell — same veil + padding language as the top letter.
 */
export function PageShell({ children, width = "letter", className = "" }: Props) {
  const max =
    width === "wide" ? "max-w-6xl lg:max-w-7xl" : "max-w-3xl md:max-w-4xl";

  return (
    <div className={`section-veil relative z-10 min-h-[100svh] pt-20 md:pt-28 lg:pt-32 ${className}`}>
      <div className={`letter-pad mx-auto w-full ${max} pb-20 md:pb-28 lg:pb-36`}>
        {children}
      </div>
    </div>
  );
}

export function PageTitle({
  children,
  eyebrow,
}: {
  children: ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className="mb-12 md:mb-16 lg:mb-20">
      {eyebrow ? (
        <p className="mb-3 text-[10px] tracking-[0.2em] text-pa-muted/55 uppercase md:text-[11px]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-display text-4xl font-medium tracking-tight text-[#F3EDE3] md:text-5xl lg:text-6xl">
        {children}
      </h1>
    </header>
  );
}
