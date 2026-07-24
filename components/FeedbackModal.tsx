"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

type FeedbackModalProps = {
  open: boolean;
  onClose: () => void;
};

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [burning, setBurning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleId = useId();
  const hasInk = message.length > 0;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => textareaRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !sending && !burning) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, sending, burning]);

  useEffect(() => {
    if (!open) {
      setMessage("");
      setError(null);
      setSending(false);
      setBurning(false);
    }
  }, [open]);

  useEffect(() => {
    if (!burning) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = reduced ? 200 : 3900;
    const t = window.setTimeout(() => onClose(), ms);
    return () => window.clearTimeout(t);
  }, [burning, onClose]);

  const send = async () => {
    const body = message.trim();
    if (!body) {
      textareaRef.current?.focus();
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "pa-website",
          message: body,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "send_failed");
      }
      setBurning(true);
    } catch {
      setError("送れませんでした。少し時間をおいて、もう一度試してください。");
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-5 py-8 md:py-10"
      role="presentation"
    >
      <button
        type="button"
        className={`feedback-veil absolute inset-0 bg-[#02050B]/78 ${
          burning ? "animate-veil-burn-out pointer-events-none" : ""
        }`}
        aria-label="閉じる"
        disabled={sending || burning}
        onClick={() => {
          if (!sending && !burning) onClose();
        }}
      />
      <div
        className={`relative z-10 w-full max-w-[26rem] md:max-w-[28rem] ${
          burning ? "pointer-events-none" : ""
        }`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`feedback-parchment relative flex max-h-[min(88svh,40rem)] w-full flex-col px-7 pb-8 pt-8 md:px-9 md:pb-9 md:pt-9 ${
            burning
              ? "is-burning overflow-hidden"
              : "animate-parchment-rise overflow-y-auto"
          }`}
        >
          <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
            <div className="mb-6 flex shrink-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display text-[10px] tracking-[0.28em] text-[#5a4630]/70 uppercase">
                  A quiet reply
                </p>
                <h2
                  id={titleId}
                  className="mt-2 font-signature text-[2rem] font-normal leading-none text-[#2a2218] md:text-[2.35rem]"
                >
                  Write back
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!sending && !burning) onClose();
                }}
                disabled={sending || burning}
                className="mt-1 font-display text-xs tracking-[0.14em] text-[#5a4630]/65 transition-opacity hover:text-[#2a2218] disabled:opacity-40"
                aria-label="閉じる"
              >
                Close
              </button>
            </div>

            <div className="mb-5 h-px w-full shrink-0 bg-[rgba(74,58,36,0.28)]" aria-hidden />

            <div className="relative min-h-[11rem] flex-1">
              <p
                aria-hidden={hasInk}
                className={`pointer-events-none absolute left-0 top-1 font-display text-[0.95rem] leading-relaxed text-[#5a4630]/35 transition-opacity duration-300 md:text-base ${
                  hasInk ? "opacity-0" : "opacity-100"
                }`}
              >
                ご意見、ご要望はこちらへ
              </p>
              <label htmlFor="feedback-message" className="sr-only">
                ご意見、ご要望
              </label>
              <textarea
                id="feedback-message"
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending || burning}
                className="h-full min-h-[11rem] w-full resize-none border-0 bg-transparent px-0 py-1 font-display text-[1.05rem] leading-[1.75] outline-none disabled:opacity-70 md:text-lg"
              />
            </div>

            {error ? (
              <p className="mt-3 shrink-0 font-display text-sm text-[#6b3f2a]/85">{error}</p>
            ) : null}

            <div className="mt-6 flex shrink-0 items-end justify-between gap-4 border-t border-[rgba(74,58,36,0.22)] pt-5">
              <p className="font-signature text-xl leading-none text-[#5a4630]/75">Pa.</p>
              <button
                type="button"
                onClick={() => void send()}
                disabled={sending || burning}
                className="font-display text-sm tracking-[0.16em] text-[#2a2218] transition-opacity hover:opacity-70 disabled:opacity-45"
              >
                {sending && !burning ? "Sending…" : "Send →"}
              </button>
            </div>
          </div>
        </div>

        {burning ? (
          <div className="feedback-burn-layer" aria-hidden>
            <div className="feedback-burn-smoke" />
            <div className="feedback-flame-band">
              {[
                { left: "4%", fw: "0.7rem", fh: "1.6rem", ff: "0.28s" },
                { left: "11%", fw: "1.05rem", fh: "2.5rem", ff: "0.34s" },
                { left: "19%", fw: "0.8rem", fh: "1.9rem", ff: "0.3s" },
                { left: "27%", fw: "1.2rem", fh: "2.8rem", ff: "0.36s" },
                { left: "36%", fw: "0.75rem", fh: "1.7rem", ff: "0.26s" },
                { left: "44%", fw: "1.1rem", fh: "2.6rem", ff: "0.33s" },
                { left: "53%", fw: "0.9rem", fh: "2.1rem", ff: "0.29s" },
                { left: "61%", fw: "1.25rem", fh: "2.9rem", ff: "0.37s" },
                { left: "70%", fw: "0.7rem", fh: "1.8rem", ff: "0.27s" },
                { left: "78%", fw: "1.05rem", fh: "2.4rem", ff: "0.35s" },
                { left: "86%", fw: "0.85rem", fh: "2rem", ff: "0.31s" },
                { left: "93%", fw: "0.95rem", fh: "2.3rem", ff: "0.32s" },
              ].map((f, i) => (
                <span
                  key={`flame-${i}`}
                  className="feedback-flame"
                  style={
                    {
                      left: f.left,
                      "--fw": f.fw,
                      "--fh": f.fh,
                      "--ff": f.ff,
                    } as CSSProperties
                  }
                />
              ))}
              {[
                { left: "18%", sx: "-0.6rem", sd: "0.95s", sdelay: "0.1s" },
                { left: "32%", sx: "0.4rem", sd: "1.15s", sdelay: "0.35s" },
                { left: "48%", sx: "-0.3rem", sd: "1.05s", sdelay: "0.05s" },
                { left: "63%", sx: "0.7rem", sd: "1.25s", sdelay: "0.45s" },
                { left: "77%", sx: "-0.5rem", sd: "1.1s", sdelay: "0.2s" },
                { left: "88%", sx: "0.2rem", sd: "0.9s", sdelay: "0.55s" },
              ].map((s, i) => (
                <span
                  key={`spark-${i}`}
                  className="feedback-spark"
                  style={
                    {
                      left: s.left,
                      "--sx": s.sx,
                      "--sd": s.sd,
                      "--sdelay": s.sdelay,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type FeedbackOpenButtonProps = {
  children: ReactNode;
  className?: string;
  onBeforeOpen?: () => void;
};

export function FeedbackOpenButton({
  children,
  className = "",
  onBeforeOpen,
}: FeedbackOpenButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          onBeforeOpen?.();
          setOpen(true);
        }}
      >
        {children}
      </button>
      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Contact — quiet, no boxed promo */
export function FeedbackBlock() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm tracking-wide text-pa-muted/70 transition-opacity hover:text-[#F3EDE3]"
      >
        Write back →
      </button>
      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
