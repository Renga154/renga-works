import Image from "next/image";
import type { Work } from "@/content/works";

/**
 * Card / modal artwork for a work.
 *
 * Three cases, in order:
 *  1. `image` — a landscape capture of the live site or the repo page. Shown
 *     full-bleed, anchored to the top so the header stays visible when cropped.
 *  2. `icon` + `shots` — a mobile app: the icon plus overlapping phone
 *     screenshots, composed here rather than pre-baked into one file, so the
 *     pieces stay separately optimisable and swappable.
 *  3. `icon` only — a mobile app with no shipped screenshots yet.
 */
export function WorkThumb({
  work,
  priority = false,
  fit = "cover",
}: {
  work: Work;
  priority?: boolean;
  /**
   * Cards crop to fill ("cover"); the modal shows the whole capture
   * ("contain"), since that is where someone actually reads the screen.
   */
  fit?: "cover" | "contain";
}) {
  if (work.image) {
    return (
      <Image
        src={work.image}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
        priority={priority}
        className={
          fit === "contain" ? "object-contain" : "object-cover object-top"
        }
      />
    );
  }

  if (work.icon && work.shots?.length) {
    const shots = work.shots.slice(0, 3);

    // Pushing the middle phone forward only reads as intentional with three of
    // them. With one or two, keep them equal and a little wider so the row
    // still fills the card instead of looking like a gap.
    const fanned = shots.length === 3;
    const width = fanned
      ? "w-[21%]"
      : shots.length === 2
        ? "w-[26%]"
        : "w-[31%]";

    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#16202e] via-[#0e1118] to-[#0a0a0b]">
        <div className="absolute inset-0 flex items-start justify-center gap-2 pt-[7%] sm:gap-3">
          {shots.map((src, i) => (
            <div
              key={src}
              className={`relative aspect-[9/19.5] shrink-0 overflow-hidden rounded-[10px] border border-white/15 shadow-xl ${
                fanned && i === 1
                  ? "z-10 -mt-[3%] w-[24%]"
                  : `${width} ${fanned ? "opacity-85" : ""}`
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="180px"
                className="object-cover object-top"
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 left-3 size-9 overflow-hidden rounded-[9px] border border-white/15 shadow-lg sm:size-11">
          <Image
            src={work.icon}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  if (work.icon) {
    return (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#16202e] via-[#0e1118] to-[#0a0a0b]">
        <div className="relative size-[26%] overflow-hidden rounded-[22%] border border-white/15 shadow-2xl">
          <Image
            src={work.icon}
            alt=""
            fill
            sizes="140px"
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#16202e] via-[#0e1118] to-[#0a0a0b]" />
  );
}
