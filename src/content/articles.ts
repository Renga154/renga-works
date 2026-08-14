import type { L10n } from "@/lib/i18n";

/**
 * 自動生成。手で編集しない。
 *
 * 正本は ~/開発/記事投稿/台帳/published.yaml。
 * 更新するには記事投稿リポジトリで `npm run sync:portfolio` を実行する。
 */

export type ArticleLink = {
  kind: "zenn" | "qiita" | "devto" | "site";
  label: string;
  href: string;
};

export type Article = {
  id: string;
  date: string; // ISO, used for sorting and display
  title: L10n;
  summary: L10n;
  links: ArticleLink[];
};

export const articles: Article[] = [
  {
    id: "dev-env-hid-eight-bugs",
    date: "2026-08-15",
    title: {
      ja: "開発環境が便利にしていたところに、バグが8件並んでいた",
      en: "My dev environment was hiding eight production bugs",
    },
    summary: {
      ja: "TestFlight に出すまでの検証を全部 __DEV__ でやっていた。本番だけを通る経路を コードで洗ったら8件出た。60秒開封が二重通知を隠し、匿名ログインが初回状態の リセットを隠し、常時オンの回線が「撮ったのに消えた」を隠していた。",
      en: "Every test had run under __DEV__, so the production-only paths had never executed. Reading them turned up eight defects — each one concealed by a convenience of the development environment itself.",
    },
    links: [
      { kind: "qiita", label: "Qiita", href: "https://qiita.com/Renga/items/9619d7f7c2ec58cfeb1f" },
      { kind: "devto", label: "dev.to", href: "https://dev.to/renga154/my-dev-environment-was-hiding-eight-production-bugs-50jg" },
      { kind: "site", label: "English", href: "https://wisp-gules-mu.vercel.app/blog/dev-env-hid-eight-bugs/" },
    ],
  },
  {
    id: "approval-dialog",
    date: "2026-08-14",
    title: {
      ja: "承認ダイアログが押せなくなった（全部見せることと、選べることは別）",
      en: "My approval dialog grew until the buttons went off screen",
    },
    summary: {
      ja: "実行するコマンドを全部見せる作りにしたら、4,558 バイトの HTML でダイアログが 画面より高くなり、承認も拒否もできなくなった。defaultId と cancelId を 揃えると macOS で Enter が死ぬことも同時に判明した。",
      en: "Showing the full command in the approval dialog meant a 4,558-byte HTML heredoc pushed the buttons off screen. Also: setting defaultId and cancelId to the same index kills the Return key on macOS.",
    },
    links: [
      { kind: "zenn", label: "Zenn", href: "https://zenn.dev/bricks/articles/approval-dialog" },
      { kind: "qiita", label: "Qiita", href: "https://qiita.com/Renga/items/0fa76dea9a7b7757e6f9" },
      { kind: "devto", label: "dev.to", href: "https://dev.to/renga154/my-approval-dialog-grew-until-the-buttons-went-off-screen-247o" },
      { kind: "site", label: "English", href: "https://wisp-gules-mu.vercel.app/blog/approval-dialog/" },
    ],
  },
  {
    id: "mask-screen-recording",
    date: "2026-08-14",
    title: {
      ja: "画面収録から利用者名を消す（目視で3回漏らして、最後は機械に検査させた話）",
      en: "I redacted my username from a screen recording three times and missed it every time",
    },
    summary: {
      ja: "思いつかない場所は目視では永久に見つからない。ダイアログの飛行中・ 半透明のフェードイン・23秒映っていた URL バーを3回とも見落とし、 最後はテンプレートマッチを全コマに掛けて機械に検査させた。",
      en: "You cannot find, by eye, the places you never thought to look. I missed a dialog mid-flight, a semi-transparent fade-in, and a URL bar that sat on screen for 23 seconds — then template-matched every frame instead.",
    },
    links: [
      { kind: "zenn", label: "Zenn", href: "https://zenn.dev/bricks/articles/mask-screen-recording" },
      { kind: "qiita", label: "Qiita", href: "https://qiita.com/Renga/items/0a6ce6f05921602b47c9" },
      { kind: "devto", label: "dev.to", href: "https://dev.to/renga154/i-redacted-my-username-from-a-screen-recording-three-times-and-missed-it-every-time-1gnd" },
      { kind: "site", label: "English", href: "https://wisp-gules-mu.vercel.app/blog/mask-screen-recording/" },
    ],
  },
  {
    id: "tts-split-by-realtime-factor",
    date: "2026-08-11",
    title: {
      ja: "TTS の分割位置は実時間比から決まる（測定環境を汚したまま設計して痛い目を見た話）",
      en: "Where to split a sentence for streaming TTS is decided by one number",
    },
    summary: {
      ja: "読み上げを分割する位置は勘ではなく実時間比 r から p ≥ r/(1+r) で決まる。 ディスクが埋まり負荷が高い状態で測ったせいで実測が4倍遅く出て、 設計を間違えた記録。",
      en: "The split point follows from the real-time factor: p ≥ r/(1+r). I measured on a machine with a full disk under heavy load, got numbers 4x too slow, and designed around them.",
    },
    links: [
      { kind: "zenn", label: "Zenn", href: "https://zenn.dev/bricks/articles/tts-split-by-realtime-factor" },
      { kind: "qiita", label: "Qiita", href: "https://qiita.com/Renga/items/bd67dd4f21ffe668cca7" },
      { kind: "devto", label: "dev.to", href: "https://dev.to/renga154/where-to-split-a-sentence-for-streaming-tts-is-decided-by-one-number-4o6b" },
      { kind: "site", label: "English", href: "https://wisp-gules-mu.vercel.app/blog/streaming-tts-split-point/" },
    ],
  },
  {
    id: "vrm-pose-portability",
    date: "2026-08-09",
    title: {
      ja: "VRM のポーズを別のモデルに当てたら顔が消えた話",
      en: "I applied a VRM pose to a different model and the face disappeared",
    },
    summary: {
      ja: "モデル間で本当に持ち運べるポーズ形式は .vrma だけだった。ボーンの ローカル座標系・humanoid 正規化・回転の合成順序という理由まで踏み込んで書いた。",
      en: "The only pose format that genuinely transfers between models is .vrma. Digging into why: bone-local coordinate systems, humanoid normalization, and rotation order.",
    },
    links: [
      { kind: "zenn", label: "Zenn", href: "https://zenn.dev/bricks/articles/vrm-pose-portability" },
      { kind: "qiita", label: "Qiita", href: "https://qiita.com/Renga/items/075269bb80e153f99240" },
    ],
  },
  {
    id: "agentrisk-intro",
    date: "2026-06-28",
    title: {
      ja: "コード経験ほぼゼロのPMOが、AI駆動開発で「AIに任せる前の安全チェックCLI」を作った話",
      en: "Building a pre-flight safety scanner for AI coding agents, with almost no coding background",
    },
    summary: {
      ja: "AIエージェントは人間より先にリポジトリの指示ファイルを読む。その前に .mcp.json や AGENTS.md を実行せずに検査する CLI を作った経緯と、 何を危険と判定しているか。",
      en: "AI agents read a repository's instruction files before any human does. Why I built a zero-execution scanner for .mcp.json and AGENTS.md, and what it flags as risky.",
    },
    links: [
      { kind: "zenn", label: "Zenn", href: "https://zenn.dev/bricks/articles/453c6e705144f4" },
      { kind: "qiita", label: "Qiita", href: "https://qiita.com/Renga/items/fdaa15095fefdaa71b59" },
    ],
  },
];
