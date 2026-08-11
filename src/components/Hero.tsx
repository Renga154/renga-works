"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { profile } from "@/content/profile";
import { BrandIcon } from "@/components/BrandIcons";

const WORD = profile.heroWord;

/**
 * Stand-in portrait shown until the generated avatar lands in /public.
 * Deliberately abstract rather than a "missing image" box.
 */
function AvatarPlaceholder() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="size-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="av-glow" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#av-glow)" />
      {/* head + shoulders silhouette */}
      <circle cx="100" cy="74" r="30" fill="rgba(255,255,255,0.10)" />
      <path
        d="M48 176c0-28.7 23.3-52 52-52s52 23.3 52 52z"
        fill="rgba(255,255,255,0.10)"
      />
      <text
        x="100"
        y="193"
        textAnchor="middle"
        fill="rgba(255,255,255,0.3)"
        fontSize="8"
        fontFamily="monospace"
        letterSpacing="2.5"
      >
        AVATAR
      </text>
    </svg>
  );
}

/** Corner handles, borrowed from the selection UI of a design tool. */
function Handles() {
  const corner =
    "absolute size-2 border border-accent bg-bg";
  return (
    <span aria-hidden="true">
      <i className={`${corner} -top-1 -left-1`} />
      <i className={`${corner} -top-1 -right-1`} />
      <i className={`${corner} -bottom-1 -left-1`} />
      <i className={`${corner} -bottom-1 -right-1`} />
      <i className={`${corner} -top-1 left-1/2 -ml-1`} />
      <i className={`${corner} -bottom-1 left-1/2 -ml-1`} />
    </span>
  );
}

export function Hero() {
  const { t } = useLang();

  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="mx-auto w-full max-w-6xl px-5 pt-28 pb-8 sm:px-8 sm:pt-36 sm:pb-12"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <h1
            id="home-heading"
            className="font-display text-[clamp(2rem,7.5vw,4.25rem)] leading-[1.15] tracking-tight"
          >
            {/* The caret is decorative; the word itself is real text so it
                paints immediately and counts as the LCP element. */}
            <span className="caret">{WORD}</span>
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-[1.9] text-muted sm:text-[15px]">
            {t(profile.intro)}
          </p>

          <p className="mt-5 border-l-2 border-accent pl-4 text-sm leading-relaxed font-medium text-fg">
            {t(profile.creed)}
          </p>

          <ul className="mt-9 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {profile.socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel group flex h-full flex-col gap-1.5 rounded-xl p-3 transition-colors hover:border-line-strong"
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
                    <BrandIcon
                      name={s.id}
                      className="size-3.5 shrink-0 text-muted transition-colors group-hover:text-accent"
                    />
                    {s.label}
                  </span>
                  <span className="font-mono text-[10px] break-all text-muted">
                    {s.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-first lg:order-none">
          <div className="relative mx-auto w-full max-w-[15rem] sm:max-w-[17rem] lg:mx-0 lg:ml-auto lg:max-w-[20rem]">
            {/* Matches the portrait's own navy backdrop so the frame reads as
                one piece, and so the placeholder shares its palette. */}
            <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-gradient-to-br from-[#153f7a] via-[#0d2246] to-[#0a0a0b]">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 19rem, 30vw"
                  priority
                  className="object-cover"
                />
              ) : (
                <AvatarPlaceholder />
              )}
            </div>
            <Handles />
          </div>
        </div>
      </div>
    </section>
  );
}
