import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <p className="eyebrow">{`// ${eyebrow}`}</p>
      <h2
        id={`${id}-heading`}
        className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {title}
      </h2>
      {lead ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {lead}
        </p>
      ) : null}
      <div className="mt-10">{children}</div>
    </section>
  );
}
