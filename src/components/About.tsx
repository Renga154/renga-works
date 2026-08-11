"use client";

import { ui, useLang } from "@/lib/i18n";
import { profile } from "@/content/profile";
import { Section } from "@/components/Section";
import { BrandIcon } from "@/components/BrandIcons";

export function About() {
  const { lang, t } = useLang();

  return (
    <Section id="about" eyebrow="About" title={t(ui.aboutTitle)}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          {profile.about[lang].map((p, i) => (
            <p key={i} className="text-[13px] leading-[2] text-muted">
              {p}
            </p>
          ))}

          {/* Housekeeping, so it sits quieter than the prose above it. */}
          <p className="border-t border-line pt-5 text-[11px] leading-[1.9] text-muted/80">
            {t(profile.analyticsNotice.text)}{" "}
            <a
              href={profile.analyticsNotice.optOutHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline underline-offset-2 transition-colors hover:text-fg"
            >
              {t(profile.analyticsNotice.optOutLabel)}
            </a>
          </p>
        </div>

        <ul className="grid h-fit gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {profile.socials.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="panel group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:border-line-strong"
              >
                <BrandIcon
                  name={s.id}
                  className="size-4 shrink-0 text-muted transition-colors group-hover:text-accent"
                />
                <span className="text-[13px] font-medium">{s.label}</span>
                <span className="ml-auto font-mono text-[11px] text-muted">
                  {s.handle}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
