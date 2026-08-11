import type { L10n } from "@/lib/i18n";

/**
 * Deliberately thin. This site is linked from social profiles, not sent to
 * recruiters — no employer, job title, education, location or figures from
 * day-job work. What's here is what I made and how I work.
 */
export const profile = {
  handle: "Renga Works",
  heroWord: "HELLO!",

  /** Null falls back to a drawn placeholder rather than a missing image. */
  avatar: "/avatar.png" as string | null,

  intro: {
    ja: "AIコーディングエージェントを開発チームとして使って、iOSアプリ・SaaS・OSSを作っています。要件を決めるところから、UXを設計して、実装を指示して、出てきたものをレビューして、テストを書いて、公開して運用するところまで通します。",
    en: "I build iOS apps, SaaS products and open-source tools, using AI coding agents as the development team. I take each one from deciding the requirements through UX, directing the implementation, reviewing what comes back, writing the tests, shipping it and running it.",
  },

  creed: {
    ja: "AIは、動くデモを作るだけでは価値にならない。",
    en: "An AI demo that runs is not yet worth anything.",
  },

  about: {
    ja: [
      "作ったものを置いておく場所として作りました。GitHub・Zenn・Qiita・X に散らばっているものが、ここからまとめて辿れます。",
      "作り方は隠していません。実装はAIコーディングエージェントに任せていて、自分がやっているのは、何を作るか決めること、どう作るかの方針を決めること、出てきたものを採用するか直すか判断すること、そして本番で壊れないところまで持っていくことです。認証・課金・データの扱い・監視まで設計して、はじめて業務で使えるものになります。そこを通していないものは、まだ作品とは呼べないと思っています。",
      "このサイト自体も同じ作り方をしています。背景で動いているのはノードとその接続を描いた WebGL のシーンで、通信が細い端末や、動きを減らす設定をしている環境では読み込まずに静的な背景へ落とします。",
    ],
    en: [
      "A place to keep the things I've made. What's scattered across GitHub, Zenn, Qiita and X is reachable from here.",
      "I'm not hiding how they get built. AI coding agents write the implementation. What I do is decide what to build, set the approach, judge whether what comes back gets accepted or reworked, and carry it to the point where it doesn't fall over in production. Auth, billing, how data is handled, monitoring — a thing only becomes usable once those are designed. Until it's been through that, I don't think it counts as finished.",
      "This site is built the same way. The scene behind the page is a WebGL field of nodes and the links between them; on a thin connection, or where reduced motion is requested, it is never loaded and a static backdrop takes its place.",
    ],
  },

  socials: [
    {
      id: "github",
      label: "GitHub",
      handle: "@Renga154",
      href: "https://github.com/Renga154",
    },
    {
      id: "zenn",
      label: "Zenn",
      handle: "@bricks",
      href: "https://zenn.dev/bricks",
    },
    {
      id: "qiita",
      label: "Qiita",
      handle: "@Renga",
      href: "https://qiita.com/Renga",
    },
    {
      id: "x",
      label: "X",
      handle: "@TanFollowAI",
      href: "https://x.com/TanFollowAI",
    },
  ],
} satisfies {
  handle: string;
  heroWord: string;
  avatar: string | null;
  intro: L10n;
  creed: L10n;
  about: { ja: string[]; en: string[] };
  socials: { id: string; label: string; handle: string; href: string }[];
};
