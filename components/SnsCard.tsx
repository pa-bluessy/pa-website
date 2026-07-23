import type { SnsItem } from "@/lib/data";

type Props = {
  item: SnsItem;
};

function Icon({ id }: { id: string }) {
  const common = "h-5 w-5";
  switch (id) {
    case "x":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      );
    case "threads":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.186 24h-.007C6.01 23.996 1.004 18.99 1 12.814v-.028C1.004 6.01 6.01 1.004 12.186 1h.028c6.176.004 11.182 5.01 11.186 11.186v.028c-.004 6.176-5.01 11.182-11.186 11.186H12.186zm6.294-13.982c-.19-2.61-1.66-4.44-4.33-4.7-.48-.05-.97-.07-1.46-.07-2.51 0-4.61 1.04-5.54 2.75-.18.34-.08.76.25.95.33.18.75.08.94-.25.66-1.22 2.22-1.95 4.35-1.95.36 0 .73.02 1.09.06 1.94.19 2.97 1.39 3.1 3.3.05.75-.05 1.51-.29 2.23-1.24-.2-2.55-.22-3.88-.05-2.74.35-4.54 1.75-4.71 3.68-.1 1.16.32 2.25 1.18 3.06.78.74 1.86 1.14 3.05 1.14 1.83 0 3.4-.8 4.42-2.26.58 1.33 1.64 1.99 3.14 1.99.28 0 .57-.03.86-.08.4-.07.67-.45.6-.85-.07-.4-.45-.67-.85-.6-.17.03-.34.04-.51.04-.89 0-1.41-.37-1.71-1.23.84-1.07 1.3-2.4 1.35-3.86.02-.46.01-.93-.04-1.38zm-4.12 5.54c-.57.74-1.44 1.15-2.51 1.15-.68 0-1.26-.22-1.67-.61-.39-.37-.59-.87-.54-1.4.1-1.14 1.32-2.02 3.38-2.28 1.05-.13 2.07-.12 3.04.03-.28 1.24-.84 2.31-1.7 3.11z" />
        </svg>
      );
    default:
      return null;
  }
}

function CardInner({ item, muted }: { item: SnsItem; muted?: boolean }) {
  return (
    <>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center border border-pa-border ${
          muted
            ? "text-pa-muted/50"
            : "text-pa-text transition-colors group-hover:border-pa-cyan/40 group-hover:text-pa-cyan"
        }`}
      >
        <Icon id={item.id} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`text-base font-medium ${muted ? "text-pa-muted" : ""}`}>
            {item.name}
          </h3>
          {item.badge ? (
            <span className="border border-pa-border px-2 py-0.5 font-sans text-[9px] tracking-wider text-pa-muted">
              {item.badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-pa-muted">{item.description}</p>
      </div>
      {!muted ? (
        <span className="text-pa-muted transition-colors group-hover:text-pa-cyan" aria-hidden>
          →
        </span>
      ) : null}
    </>
  );
}

export function SnsCard({ item }: Props) {
  if (item.comingSoon || !item.href) {
    return (
      <div
        className="relative overflow-hidden border border-pa-border bg-[rgba(10,18,35,0.4)] px-5 py-5"
        aria-disabled="true"
      >
        <div className="flex items-center gap-4 opacity-40">
          <CardInner item={item} muted />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#03050B]/55 backdrop-blur-[2px]">
          <span className="border border-pa-border bg-[rgba(10,18,35,0.85)] px-4 py-1.5 font-sans text-[11px] tracking-[0.22em] text-pa-muted/90">
            準備中
          </span>
        </div>
      </div>
    );
  }

  const external = item.href.startsWith("http");

  return (
    <a
      href={item.href}
      className="group flex items-center gap-4 border border-pa-border bg-[rgba(10,18,35,0.4)] px-5 py-5 backdrop-blur-sm transition-all duration-300 hover:border-pa-cyan/35 hover:shadow-glow"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <CardInner item={item} />
    </a>
  );
}
