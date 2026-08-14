"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

export type Lang = "ja" | "en";

/** A string that exists in both languages. */
export type L10n = { ja: string; en: string };

const STORAGE_KEY = "rw-lang";
const DEFAULT_LANG: Lang = "ja";

/*
 * localStorage is an external store, so it is read through useSyncExternalStore
 * rather than copied into state inside an effect. React renders
 * getServerSnapshot() during SSR and hydration and only then swaps to the
 * stored value, so server and client markup always agree on the first pass.
 */
let cached: Lang | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Lang {
  if (cached !== null) return cached;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    cached = stored === "en" || stored === "ja" ? stored : DEFAULT_LANG;
  } catch {
    cached = DEFAULT_LANG;
  }
  return cached;
}

function getServerSnapshot(): Lang {
  return DEFAULT_LANG;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function writeLang(next: Lang) {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Private browsing can reject writes; the toggle still works in-session.
  }
  listeners.forEach((fn) => fn());
}

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Pick the active language out of an L10n pair. */
  t: (s: L10n) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => writeLang(l), []);

  const t = useCallback((s: L10n) => s[lang], [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

/** UI chrome strings. Content strings live in src/content/. */
export const ui = {
  navHome: { ja: "HOME", en: "HOME" },
  navWorks: { ja: "WORKS", en: "WORKS" },
  navWriting: { ja: "WRITING", en: "WRITING" },
  navStack: { ja: "STACK", en: "STACK" },
  navAbout: { ja: "ABOUT", en: "ABOUT" },

  worksTitle: { ja: "作ったもの", en: "Works" },
  worksLead: {
    ja: "要件を決めるところから、公開して運用するところまで通したものを並べています。",
    en: "Things I took all the way from deciding the requirements to shipping and running them.",
  },
  writingTitle: { ja: "書いたもの", en: "Writing" },
  writingLead: {
    ja: "作る過程で詰まったことと、その解き方を書いています。",
    en: "What I got stuck on while building, and how I got unstuck.",
  },
  writingNotes: {
    ja: "英語版は Wisp のサイトに Notes としてまとめています",
    en: "The English versions are collected as Notes on the Wisp site",
  },
  stackTitle: { ja: "使っているもの", en: "Stack" },
  aboutTitle: { ja: "このサイトについて", en: "About" },

  viewDetails: { ja: "詳細", en: "Details" },
  viewDemo: { ja: "デモ", en: "Demo" },
  viewCode: { ja: "コード", en: "Code" },
  coreTech: { ja: "主な技術", en: "Core Technologies" },
  close: { ja: "閉じる", en: "Close" },
  openModalHint: { ja: "の詳細を開く", en: " — open details" },

  readOn: { ja: "で読む", en: "Read on" },
  skipToContent: { ja: "本文へスキップ", en: "Skip to content" },
  langLabel: { ja: "言語を切り替える", en: "Switch language" },
} satisfies Record<string, L10n>;
