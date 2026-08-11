"use client";

import { profile } from "@/content/profile";
import { BrandIcon } from "@/components/BrandIcons";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pt-8 pb-14 sm:px-8">
      <div className="flex flex-col items-center gap-5 border-t border-line pt-8 sm:flex-row sm:justify-between">
        <p className="font-mono text-[11px] text-muted">
          © {profile.handle}
        </p>
        <ul className="flex items-center gap-1">
          {profile.socials.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-fg"
              >
                <BrandIcon name={s.id} className="size-4" title={s.label} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
