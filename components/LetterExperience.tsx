"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LetterState = "sealed" | "cracking" | "fading" | "open";

type LetterContextValue = {
  state: LetterState;
  open: () => void;
  isHome: boolean;
  endingInView: boolean;
  setEndingInView: (v: boolean) => void;
};

const LetterContext = createContext<LetterContextValue>({
  state: "open",
  open: () => undefined,
  isHome: false,
  endingInView: false,
  setEndingInView: () => undefined,
});

export function useLetter() {
  return useContext(LetterContext);
}

const LETTER_OPENED_KEY = "pa-letter-opened";

function hasOpenedLetter() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(LETTER_OPENED_KEY) === "1";
  } catch {
    return false;
  }
}

function markLetterOpened() {
  try {
    sessionStorage.setItem(LETTER_OPENED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function LetterProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [state, setState] = useState<LetterState>("sealed");
  const [endingInView, setEndingInView] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const opened = hasOpenedLetter();
    setState(!isHome || opened ? "open" : "sealed");
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial hydrate only
  }, []);

  useEffect(() => {
    if (!ready) return;
    setEndingInView(false);
    if (!isHome) {
      setState("open");
      return;
    }
    setState(hasOpenedLetter() ? "open" : "sealed");
  }, [isHome, ready]);

  useEffect(() => {
    if (!isHome || state === "open") {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isHome, state]);

  const finishOpen = useCallback(() => {
    markLetterOpened();
    setState("open");
    document.body.style.overflow = "";
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const open = useCallback(() => {
    if (state !== "sealed") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      finishOpen();
      return;
    }
    setState("cracking");
    window.setTimeout(() => setState("fading"), 380);
    window.setTimeout(() => finishOpen(), 1600);
  }, [state, finishOpen]);

  const value = useMemo(
    () => ({ state, open, isHome, endingInView, setEndingInView }),
    [state, open, isHome, endingInView]
  );

  return (
    <LetterContext.Provider value={value}>
      {children}
      {ready && isHome && state !== "open" ? <LetterGate /> : null}
    </LetterContext.Provider>
  );
}

function LetterGate() {
  const { state, open } = useLetter();
  const [showOpen, setShowOpen] = useState(false);

  useEffect(() => {
    if (state !== "sealed") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 400 : 2600;
    const t = window.setTimeout(() => setShowOpen(true), delay);
    return () => window.clearTimeout(t);
  }, [state]);

  const cracking = state === "cracking";
  const fading = state === "fading";

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center transition-opacity duration-[1200ms] ease-out ${
        fading ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
      }`}
      aria-hidden={fading}
    >
      <button
        type="button"
        onClick={open}
        disabled={state !== "sealed"}
        className="flex flex-col items-center"
        aria-label="Open letter"
      >
        <span
          className={`relative inline-block ${cracking ? "animate-seal-crack" : ""} ${
            fading ? "opacity-0 transition-opacity duration-[1200ms]" : ""
          }`}
        >
          <Image
            src="/images/pa-wax-seal.png"
            alt=""
            width={120}
            height={120}
            className="h-[100px] w-[100px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] md:h-[120px] md:w-[120px]"
            priority
            unoptimized
          />
        </span>
        <span
          className={`mt-10 font-display text-sm tracking-[0.28em] text-[#F3EDE3]/85 transition-opacity duration-[1.2s] ease-out ${
            showOpen && state === "sealed" ? "opacity-100" : "opacity-0"
          }`}
        >
          Open
        </span>
      </button>
    </div>
  );
}

/** Fades letter body in after Open */
export function LetterBody({ children }: { children: ReactNode }) {
  const { state, isHome } = useLetter();
  const visible = !isHome || state === "open";

  return (
    <div
      className={`transition-opacity duration-[1400ms] ease-out ${
        visible
          ? "opacity-100"
          : "pointer-events-none min-h-[100svh] overflow-hidden opacity-0"
      }`}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
