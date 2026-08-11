import type { L10n } from "@/lib/i18n";

export type Article = {
  id: string;
  date: string; // ISO, used for sorting and display
  title: L10n;
  summary: L10n;
  /** Same piece, published on both platforms. Either may be absent. */
  zenn?: string;
  qiita?: string;
};

/**
 * Titles and dates verified against the live Zenn and Qiita pages.
 * All three are cross-posted, so each entry carries both URLs.
 */
export const articles: Article[] = [
  {
    id: "tts-split",
    date: "2026-08-11",
    title: {
      ja: "TTS の分割位置は実時間比から決まる（測定環境を汚したまま設計して痛い目を見た話）",
      en: "Where to split TTS text follows from the real-time factor — and what happens when you measure on a dirty machine",
    },
    summary: {
      ja: "読み上げを分割する位置は勘ではなく実時間比 r から p ≥ r/(1+r) で決まる。ディスクが埋まり負荷が高い状態で測ったせいで実測が4倍遅く出て、設計を間違えた記録。",
      en: "The split point follows from the real-time factor: p ≥ r/(1+r). I measured on a machine with a full disk under heavy load, got numbers 4x too slow, and designed around them.",
    },
    zenn: "https://zenn.dev/bricks/articles/tts-split-by-realtime-factor",
    qiita: "https://qiita.com/Renga/items/bd67dd4f21ffe668cca7",
  },
  {
    id: "vrm-pose",
    date: "2026-08-09",
    title: {
      ja: "VRM のポーズを別のモデルに当てたら顔が消えた話",
      en: "I applied a VRM pose to a different model and the face disappeared",
    },
    summary: {
      ja: "モデル間で本当に持ち運べるポーズ形式は .vrma だけだった。ボーンのローカル座標系・humanoid 正規化・回転の合成順序という理由まで踏み込んで書いた。",
      en: "The only pose format that genuinely transfers between models is .vrma. Digging into why: bone-local coordinate systems, humanoid normalization, and rotation order.",
    },
    zenn: "https://zenn.dev/bricks/articles/vrm-pose-portability",
    qiita: "https://qiita.com/Renga/items/075269bb80e153f99240",
  },
  {
    id: "agentrisk",
    date: "2026-06-28",
    title: {
      ja: "コード経験ほぼゼロのPMOが、AI駆動開発で「AIに任せる前の安全チェックCLI」を作った話",
      en: "Building a pre-flight safety scanner for AI coding agents, with almost no coding background",
    },
    summary: {
      ja: "AIエージェントは人間より先にリポジトリの指示ファイルを読む。その前に .mcp.json や AGENTS.md を実行せずに検査する CLI を作った経緯と、何を危険と判定しているか。",
      en: "AI agents read a repository's instruction files before any human does. Why I built a zero-execution scanner for .mcp.json and AGENTS.md, and what it flags as risky.",
    },
    zenn: "https://zenn.dev/bricks/articles/453c6e705144f4",
    qiita: "https://qiita.com/Renga/items/fdaa15095fefdaa71b59",
  },
];
