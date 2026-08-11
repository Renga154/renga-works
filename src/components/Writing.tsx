"use client";

import { ui, useLang } from "@/lib/i18n";
import { articles } from "@/content/articles";
import { Section } from "@/components/Section";
import { BrandIcon } from "@/components/BrandIcons";

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
                {a.zenn ? (
                  <a
                    href={a.zenn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <BrandIcon name="zenn" className="size-3" />
                    Zenn
                  </a>
                ) : null}
                {a.qiita ? (
                  <a
                    href={a.qiita}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <BrandIcon name="qiita" className="size-3" />
                    Qiita
                  </a>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
