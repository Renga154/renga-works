"use client";

import { useEffect, useState } from "react";
import { ui, useLang } from "@/lib/i18n";

const SECTIONS = [
  { id: "home", label: ui.navHome },
  { id: "works", label: ui.navWorks },
  { id: "writing", label: ui.navWriting },
  { id: "stack", label: ui.navStack },
  { id: "about", label: ui.navAbout },
];

export function Nav() {
  const { lang, setLang, t } = useLang();
  const [active, setActive] = useState("home");

  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    // Bias the observation band toward the upper third so a section counts as
    // "current" once its heading area is in view, not when it fills the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-5">
      <nav
        aria-label="Primary"
        className="panel pointer-events-auto flex w-full max-w-4xl items-center gap-2 rounded-full py-2 pr-2 pl-3 sm:gap-4 sm:pl-4"
      >
        {/* Window-chrome dots — the motif the whole site leans on. */}
        <span
          className="hidden shrink-0 items-center gap-1.5 sm:flex"
          aria-hidden="true"
        >
          <i className="block size-2.5 rounded-full bg-[#ff5f57]" />
          <i className="block size-2.5 rounded-full bg-[#febc2e]" />
          <i className="block size-2.5 rounded-full bg-[#28c840]" />
        </span>

        <a
          href="#home"
          className="shrink-0 font-mono text-[13px] font-semibold tracking-tight whitespace-nowrap text-fg"
        >
          <span className="text-accent">R</span>enga Works
        </a>

        {/* Narrow screens scroll this row rather than hiding it — the page is
            long, so the section links have to stay reachable. */}
        <ul className="no-scrollbar ml-auto flex items-center gap-0.5 overflow-x-auto md:overflow-visible">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`block rounded-full px-2.5 py-1.5 font-mono text-[11px] tracking-widest whitespace-nowrap transition-colors sm:px-3 ${
                    isActive ? "bg-fg text-bg" : "text-muted hover:text-fg"
                  }`}
                >
                  {t(s.label)}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="ml-1 shrink-0 sm:ml-2">
          <div
            role="group"
            aria-label={t(ui.langLabel)}
            className="flex items-center rounded-full border border-line p-0.5"
          >
            {(["ja", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-wider transition-colors ${
                  lang === l ? "bg-fg text-bg" : "text-muted hover:text-fg"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

export function SkipLink() {
  const { t } = useLang();
  return (
    <a
      href="#works"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
    >
      {t(ui.skipToContent)}
    </a>
  );
}
