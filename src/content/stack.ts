import type { L10n } from "@/lib/i18n";

export type StackGroup = {
  id: string;
  label: L10n;
  items: string[];
};

/** Only things actually used in the works listed on this site. */
export const stack: StackGroup[] = [
  {
    id: "ai",
    label: { ja: "AI / エージェント", en: "AI / Agents" },
    items: [
      "Claude Code",
      "Codex",
      "OpenAI Realtime API",
      "Gemini",
      "MCP",
      "Agent Skills",
      "OpenRouter",
    ],
  },
  {
    id: "frontend",
    label: { ja: "フロントエンド", en: "Frontend" },
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "three.js",
      "React Native",
      "Expo",
    ],
  },
  {
    id: "backend",
    label: { ja: "バックエンド / データ", en: "Backend / Data" },
    items: [
      "Node.js",
      "Supabase",
      "PostgreSQL",
      "Row Level Security",
      "Firebase",
      "Firestore",
    ],
  },
  {
    id: "infra",
    label: { ja: "インフラ / 運用", en: "Infrastructure / Ops" },
    items: ["Vercel", "Cloudflare", "Sentry", "GitHub Actions", "EAS Build"],
  },
  {
    id: "native",
    label: { ja: "ネイティブ / 3D", en: "Native / 3D" },
    items: ["iOS", "Swift", "Electron", "VRM", "VRoid Studio", "Blender"],
  },
  {
    id: "quality",
    label: { ja: "品質 / 安全", en: "Quality / Safety" },
    items: [
      "Vitest",
      "SARIF",
      "SSRF Hardening",
      "RevenueCat",
      "App Store Review",
    ],
  },
];
