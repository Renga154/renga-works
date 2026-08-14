"use client";

import { ui, useLang } from "@/lib/i18n";
import { articles, type ArticleLink } from "@/content/articles";
import { Section } from "@/components/Section";
import { BrandIcon } from "@/components/BrandIcons";

/** 記事リンクの種別 → brandPaths のキー。 */
const iconFor: Record<ArticleLink["kind"], string> = {
  zenn: "zenn",
  qiita: "qiita",
  devto: "devdotto",
  site: "globe",
};

export function Writing() {
  const { lang, t } = useLang();

  const fmt = new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Section
      id="writing"
      eyebrow="Writing"
      title={t(ui.writingTitle)}
      lead={t(ui.writingLead)}
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {articles.map((a) => (
          <li key={a.id} className="min-w-0">
            <article className="panel flex h-full flex-col rounded-2xl p-5">
              <time
                dateTime={a.date}
                className="font-mono text-[10px] tracking-wide text-muted"
              >
                {fmt.format(new Date(a.date))}
              </time>

              <h3 className="mt-2 text-sm leading-relaxed font-semibold tracking-tight">
                {t(a.title)}
              </h3>

              <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-muted">
                {t(a.summary)}
              </p>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                {a.links.map((l) => (
                  <a
                    key={l.kind}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <BrandIcon name={iconFor[l.kind]} className="size-3" />
                    {l.label}
                  </a>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* 英語記事の本体は Wisp のサイト側にある。ここから辿れないと、
          記事カードの「English」を踏んだ人しか全体に気付けない。 */}
      <p className="mt-6 text-[13px] text-muted">
        <a
          href="https://wisp-gules-mu.vercel.app/blog/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
        >
          <BrandIcon name="globe" className="size-3.5 shrink-0" />
          {t(ui.writingNotes)}
          <span aria-hidden="true">↗</span>
        </a>
      </p>
    </Section>
  );
}
