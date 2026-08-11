/**
 * Canonical origin, used by metadata, OGP, sitemap.xml and robots.txt.
 *
 * Deliberately derived rather than hard-coded. A canonical URL pointing at a
 * domain that doesn't serve this site is worse than an ugly one: search engines
 * treat it as "the real version lives there" and the OGP image 404s, so share
 * cards break.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL — explicit override, if you ever need one.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — set by Vercel on every build. It resolves
 *     to the shortest production custom domain, falling back to the .vercel.app
 *     one. Attach a domain later and the next deploy picks it up on its own,
 *     with no code change.
 *  3. localhost, for `next dev`.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel supplies the host without a protocol scheme.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
