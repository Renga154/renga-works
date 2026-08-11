"use client";

import { ui, useLang } from "@/lib/i18n";
import { stack } from "@/content/stack";
import { Section } from "@/components/Section";
import { BrandIcon, techIconMap } from "@/components/BrandIcons";

export function Stack() {
  const { t } = useLang();

  return (
    <Section id="stack" eyebrow="Stack" title={t(ui.stackTitle)}>
      <div className="space-y-7">
        {stack.map((group) => (
          <div
            key={group.id}
            className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-5"
          >
            <h3 className="font-mono text-[11px] tracking-widest text-muted uppercase sm:pt-1.5">
              {t(group.label)}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => {
                const icon = techIconMap[item];
                return (
                  <li key={item} className="chip">
                    {icon ? (
                      <BrandIcon name={icon} className="size-3.5 text-muted" />
                    ) : (
                      <span
                        className="block size-1.5 rounded-full bg-accent/60"
                        aria-hidden="true"
                      />
                    )}
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
