"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { ui, useLang } from "@/lib/i18n";
import { works, type Work } from "@/content/works";
import { Section } from "@/components/Section";
import { WorkCard } from "@/components/WorkCard";

// The modal only appears once a card is clicked, and it is the only thing on
// the page that pulls in the animation library — so it is a separate chunk
// rather than part of the initial payload.
const WorkModal = dynamic(
  () => import("@/components/WorkModal").then((m) => m.WorkModal),
  { ssr: false },
);

export function Works() {
  const { t } = useLang();
  const [open, setOpen] = useState<Work | null>(null);

  // Once opened, the modal stays mounted so AnimatePresence can play its exit.
  // Before that it is never rendered, so its chunk is never requested.
  const [mounted, setMounted] = useState(false);

  const handleOpen = useCallback((w: Work) => {
    setMounted(true);
    setOpen(w);
  }, []);
  const close = useCallback(() => setOpen(null), []);

  // Warm the chunk as soon as the pointer reaches the grid, so the first
  // click still feels immediate.
  const prefetch = useCallback(() => {
    void import("@/components/WorkModal");
  }, []);

  return (
    <>
      <Section
        id="works"
        eyebrow="Works"
        title={t(ui.worksTitle)}
        lead={t(ui.worksLead)}
      >
        <ul
          className="grid gap-5 sm:grid-cols-2"
          onPointerEnter={prefetch}
          onFocusCapture={prefetch}
        >
          {works.map((w) => (
            <li key={w.id} className="min-w-0">
              <WorkCard work={w} onOpen={handleOpen} />
            </li>
          ))}
        </ul>
      </Section>

      {mounted ? <WorkModal work={open} onClose={close} /> : null}
    </>
  );
}
