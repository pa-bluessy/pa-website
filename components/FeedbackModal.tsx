"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

type FeedbackModalProps = {
  open: boolean;
  onClose: () => void;
};

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleId = useId();

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
      if (e.key === "Escape" && !sending) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, sending]);

  useEffect(() => {
    if (!open) {
      setMessage("");
      setError(null);
      setSent(false);
      setSending(false);
    }
  }, [open]);

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
      setSent(true);
      window.setTimeout(() => onClose(), 900);
    } catch {
      setError("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-5" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[#03050B]/75 backdrop-blur-sm"
        aria-label="閉じる"
        onClick={() => {
          if (!sending) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md border border-pa-border bg-[#07101F] p-5 shadow-glow md:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={titleId} className="font-sans text-[11px] tracking-[0.22em] text-pa-muted/80">
            FEEDBACK
          </h2>
          <button
            type="button"
            onClick={() => {
              if (!sending) onClose();
            }}
            className="inline-flex h-8 w-8 items-center justify-center text-pa-muted transition-colors hover:text-pa-text"
            aria-label="閉じる"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {sent ? (
          <p className="py-8 text-center text-sm text-[#F3EDE3]/80">送信しました。ありがとうございます。</p>
        ) : (
          <>
            <label htmlFor="feedback-message" className="sr-only">
              フィードバック内容
            </label>
            <textarea
              id="feedback-message"
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              disabled={sending}
              placeholder="メッセージを入力..."
              className="w-full resize-none border border-pa-border bg-[rgba(10,18,35,0.65)] px-3 py-3 text-sm text-pa-text outline-none transition-colors placeholder:text-pa-muted/60 focus:border-pa-cyan/40 disabled:opacity-60"
            />

            {error ? <p className="mt-3 text-xs text-red-300/90">{error}</p> : null}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => void send()}
                disabled={sending}
                className="inline-flex items-center gap-2 border border-pa-cyan/40 bg-pa-cyan/10 px-5 py-2.5 text-sm text-pa-cyan transition-colors hover:border-pa-cyan/70 hover:bg-pa-cyan/20 disabled:opacity-50"
              >
                {sending ? "送信中..." : "送信"}
                <span aria-hidden>→</span>
              </button>
            </div>
          </>
        )}
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
