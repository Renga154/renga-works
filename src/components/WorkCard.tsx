"use client";

import { useRef } from "react";
import { ExternalLink, Code2, ArrowUpRight } from "lucide-react";
import { ui, useLang } from "@/lib/i18n";
import { statusLabel, type Work } from "@/content/works";
import { WorkThumb } from "@/components/WorkThumb";

const statusTone: Record<Work["status"], string> = {
  appstore: "text-accent border-accent/35 bg-accent/10",
  production: "text-accent border-accent/35 bg-accent/10",
  oss: "text-[#8fb0ff] border-[#4c7dff]/35 bg-[#4c7dff]/10",
  sale: "text-[#8fb0ff] border-[#4c7dff]/35 bg-[#4c7dff]/10",
  wip: "text-muted border-line-strong bg-white/5",
};

const MAX_TILT = 6;

export function WorkCard({
  work,
  onOpen,
}: {
  work: Work;
  onOpen: (w: Work) => void;
}) {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);

  // Tilt is written straight to CSS custom properties so it stays on the
  // compositor — no React state, no re-render per pointer move.
  function handleMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${px * MAX_TILT * 2}deg`);
    el.style.setProperty("--rx", `${-py * MAX_TILT * 2}deg`);
    el.classList.add("tilt-active");
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
    el.classList.remove("tilt-active");
  }

  const primary = work.links.find(
    (l) => l.kind === "demo" || l.kind === "site" || l.kind === "store",
  );
  const code = work.links.find((l) => l.kind === "code");

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="tilt panel group flex h-full flex-col overflow-hidden rounded-2xl"
    >
      <button
        type="button"
        onClick={() => onOpen(work)}
        className="relative block aspect-[16/10] w-full overflow-hidden border-b border-line text-left"
      >
        <WorkThumb work={work} />
        <span className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <span className="sr-only">
          {work.name}
          {t(ui.openModalHint)}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-semibold tracking-tight">
            {work.name}
          </h3>
          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide ${statusTone[work.status]}`}
          >
            {t(statusLabel[work.status])}
          </span>
          <span className="ml-auto font-mono text-[10px] text-muted">
            {work.year}
          </span>
        </div>

        <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
          {t(work.tagline)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => onOpen(work)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white/5 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
          >
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
            {t(ui.viewDetails)}
          </button>

          {primary ? (
            <a
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              {t(primary.label)}
            </a>
          ) : null}

          {code ? (
            <a
              href={code.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <Code2 className="size-3.5" aria-hidden="true" />
              {t(code.label)}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
