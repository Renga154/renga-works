import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { LangProvider } from "@/lib/i18n";
import { Backdrop } from "@/components/Backdrop";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Latin-only display face for the hero wordmark. Tiny, and the only webfont
// carrying real weight — Japanese text falls back to system faces on purpose,
// since self-hosting a CJK family would eat most of the page budget.
const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Renga Works",
    template: "%s | Renga Works",
  },
  description:
    "AIコーディングエージェントを使って、iOSアプリ・SaaS・OSSを本番まで作っています。作品と技術記事の一覧。",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Renga Works",
    title: "Renga Works",
    description:
      "AIコーディングエージェントを使って、iOSアプリ・SaaS・OSSを本番まで作っています。",
    // The card image comes from app/opengraph-image.tsx, which Next wires up
    // automatically — declaring one here would override the generated route.
  },
  twitter: {
    card: "summary_large_image",
    site: "@TanFollowAI",
    creator: "@TanFollowAI",
    title: "Renga Works",
    description:
      "AIコーディングエージェントを使って、iOSアプリ・SaaS・OSSを本番まで作っています。",
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

/**
 * Analytics loads only on the production deployment, and only once a
 * measurement ID is configured. Preview deployments and local development
 * would otherwise pollute the numbers with your own testing — which is the
 * usual reason a fresh property shows traffic nobody actually sent.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * 二つ目の送り先。作っているものを横断して見るためのプロパティで、
 * Wisp の LP と BOOTH のショップにも同じ ID が入っている。
 *
 * このサイトの元からのプロパティは**そのまま残す**。切り替えてしまうと
 * 履歴が二つに割れる。GA4 は一つのページから複数のプロパティへ送れるので、
 * 足すだけにした。こちらに送ることで
 * **短尺 → このサイト → BOOTH** が一本の流れとして見える。
 */
const FUNNEL_GA_ID = "G-3Y617WB6F4";
const ANALYTICS_ENABLED =
  Boolean(GA_ID) && process.env.VERCEL_ENV === "production";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Font variables belong on <html>: the @theme font stacks are declared on
  // :root and reference them, so they have to resolve at the same element.
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <LangProvider>
          <Backdrop />
          {children}
        </LangProvider>
      </body>
      {ANALYTICS_ENABLED ? (
        <>
          <GoogleAnalytics gaId={GA_ID!} />
          {/* gtag.js は GoogleAnalytics が読み込む。ここは config を足すだけ */}
          <Script id="ga-funnel" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('config', '${FUNNEL_GA_ID}');`}
          </Script>
        </>
      ) : null}
    </html>
  );
}
