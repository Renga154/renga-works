"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { ui, useLang } from "@/lib/i18n";
import { statusLabel, type Work } from "@/content/works";
import { WorkThumb } from "@/components/WorkThumb";
import { BrandIcon, techIconMap } from "@/components/BrandIcons";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function WorkModal({
  work,
  onClose,
}: {
  work: Work | null;
  onClose: () => void;
}) {
  const { t } = useLang();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!work) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    // Lock scroll without the layout jump that removing the scrollbar causes.
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      restoreRef.current?.focus?.();
    };
  }, [work, onClose]);

  return (
    // This wrapper stays outside AnimatePresence on purpose. During an exit
    // AnimatePresence re-renders the *previous* child, so nothing inside it can
    // see that `work` is now null. Gating pointer events out here means a
    // closing dialog stops accepting input immediately — even if its exit
    // animation stalls, which happens when a tab is backgrounded mid-close and
    // the frame loop stops. Children inherit `none`; none of them opt back in.
    <div
      className={`fixed inset-0 z-[60] ${work ? "" : "pointer-events-none"}`}
      style={{ perspective: "1400px" }}
    >
      <AnimatePresence>
        {work ? (
          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="work-modal-title"
              initial={{ opacity: 0, y: 18, rotateX: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, rotateX: 6, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-line-strong bg-surface shadow-2xl"
            >
              {/* Window chrome */}
              <div className="flex shrink-0 items-center gap-2 border-b border-line bg-white/[0.03] px-3 py-2.5">
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  <i className="block size-2.5 rounded-full bg-[#ff5f57]" />
                  <i className="block size-2.5 rounded-full bg-[#febc2e]" />
                  <i className="block size-2.5 rounded-full bg-[#28c840]" />
                </span>
                <p
                  id="work-modal-title"
                  className="mx-auto truncate px-3 font-mono text-[11px] text-muted"
                >
                  {work.name} — {t(statusLabel[work.status])} · {work.year}
                </p>
                <button
                  type="button"
                  data-autofocus
                  onClick={onClose}
                  aria-label={t(ui.close)}
                  className="rounded-md p-1 text-muted transition-colors hover:bg-white/10 hover:text-fg"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="grid flex-1 gap-0 overflow-y-auto md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-line md:aspect-auto md:min-h-full md:border-r md:border-b-0">
                  <WorkThumb work={work} />
                </div>

                <div className="flex flex-col p-5 sm:p-6">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {work.name}
                  </h3>
                  <p className="mt-1 text-[13px] text-accent">
                    {t(work.tagline)}
                  </p>

                  <p className="mt-4 text-[13px] leading-[1.95] text-muted">
                    {t(work.body)}
                  </p>

                  <p className="eyebrow mt-6">{t(ui.coreTech)}</p>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {work.tech.map((tech) => {
                      const icon = techIconMap[tech];
                      return (
                        <li key={tech} className="chip">
                          {icon ? (
                            <BrandIcon
                              name={icon}
                              className="size-3 text-muted"
                            />
                          ) : null}
                          {tech}
                        </li>
                      );
                    })}
                  </ul>

                  {work.links.length > 0 ? (
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                      {work.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white/5 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
                        >
                          {t(l.label)}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
