import type { L10n } from "@/lib/i18n";

export type WorkStatus = "appstore" | "production" | "oss" | "sale" | "wip";

export type WorkLink = {
  kind: "demo" | "code" | "store" | "article" | "site";
  label: L10n;
  href: string;
};

export type Work = {
  id: string;
  name: string;
  status: WorkStatus;
  year: string;
  tagline: L10n;
  body: L10n;
  tech: string[];
  links: WorkLink[];
  /**
   * Landscape capture — the live site, or the repo page for OSS. Rendered
   * full-bleed. Takes precedence over icon/shots.
   */
  image?: string;
  /** App icon, for the mobile apps. */
  icon?: string;
  /** Portrait app screenshots, shown as an overlapping row. */
  shots?: string[];
};

export const statusLabel: Record<WorkStatus, L10n> = {
  appstore: { ja: "App Store 公開", en: "On the App Store" },
  production: { ja: "本番稼働", en: "In production" },
  oss: { ja: "OSS", en: "Open source" },
  sale: { ja: "販売中", en: "On sale" },
  wip: { ja: "開発中", en: "In progress" },
};

const L = {
  store: { ja: "App Store", en: "App Store" },
  demo: { ja: "デモ", en: "Demo" },
  site: { ja: "サイト", en: "Site" },
  code: { ja: "コード", en: "Code" },
  zenn: { ja: "Zenn", en: "Zenn" },
  qiita: { ja: "Qiita", en: "Qiita" },
  booth: { ja: "BOOTH", en: "BOOTH" },
} satisfies Record<string, L10n>;

export const works: Work[] = [
  {
    id: "koeha",
    name: "Koeha",
    status: "appstore",
    year: "2026",
    tagline: {
      ja: "3分話すだけで、AIが日記を書く",
      en: "Talk for three minutes; an AI writes the journal entry.",
    },
    body: {
      ja: "日記が続かない理由は「書くのが面倒」なので、書くのをやめて話すことにした音声ジャーナリングアプリ。音声対話は遅延がすべてなので OpenAI Realtime API、日記の生成は品質が効くので Gemini、と用途でモデルを分けている。認証とデータは Supabase（Auth / PostgreSQL / RLS）、課金は RevenueCat。課金の検証はサーバー側を正とし、クライアントの申告を信用しない。音声を第三者のAIへ送ることは、何を・どこへ・何のために送るかを明示して同意を取る。AIが書いたコードは読んで正しそうでも動くとは限らないので、振る舞いのほうを23スイート・284テストで固定した。App Store の審査指摘を解消して公開している。",
      en: "People stop journaling because writing is a chore, so this one replaces writing with talking. Two models, split by what each is good at: OpenAI's Realtime API for the conversation, where latency is everything, and Gemini for composing the entry, where quality is. Supabase (Auth / PostgreSQL / RLS) holds the data; RevenueCat handles purchases, verified server-side rather than trusting what the client claims. Sending voice to a third-party AI is gated behind explicit consent that names what goes where and why. AI-written code can read correctly and still not work, so I pinned the behaviour instead: 23 suites, 284 tests. Shipped after clearing App Store review.",
    },
    tech: [
      "iOS",
      "OpenAI Realtime API",
      "Gemini",
      "Supabase",
      "PostgreSQL",
      "RLS",
      "RevenueCat",
      "AdMob",
    ],
    links: [
      {
        kind: "store",
        label: L.store,
        href: "https://apps.apple.com/jp/app/koeha/id6781737825",
      },
    ],
    icon: "/works/icon-koeha.png",
    shots: ["/works/koeha-1.png", "/works/koeha-2.png", "/works/koeha-3.png"],
  },
  {
    id: "kensaops",
    name: "KensaOps",
    status: "production",
    year: "2026",
    tagline: {
      ja: "サイト品質の確認と、白ラベルの月次レポートを一体にした",
      en: "Site quality checks and white-label monthly reports, in one pass.",
    },
    body: {
      ja: "Web制作・運用会社向けのSaaS。公開サイトを読み取り専用でスキャンして、リンク切れ・メタデータ・アクセシビリティの基礎的な問題を拾い、AIの要約とスクリーンショットの証拠を合わせて、顧客にそのまま出せるHTML／PDFレポートを生成する。AIありきで作らず、AIが効く形の業務課題（手作業の月次レポート）を先に選んだ。AIへ渡すのは生HTMLではなく保存済みの構造化データだけに絞っている。入力を絞ることがそのまま統制になる。白ラベルは顧客への保証になってしまうので、断定や保証にあたる表現は出力させない。外部URLを取りに行く以上SSRFは前提で、リダイレクト先まで検証し、クロール上限を設け、外部フォームへは送信しない。認証・課金・分析・監視・ワーカーまで含めて本番構成で動かしている。",
      en: "A SaaS for web production and maintenance agencies. It scans a public site read-only, catches broken links, metadata problems and baseline accessibility issues, then combines an AI summary with screenshot evidence into an HTML/PDF report the agency can hand straight to its client. I picked the problem before picking AI: monthly reports built by hand are exactly the shape of work AI helps with. The model only ever sees stored structured data, never raw HTML — narrowing the input is itself the control. Because a white-label report becomes the agency's promise to its client, the output is not allowed to assert or guarantee. Fetching arbitrary URLs means assuming SSRF: redirect targets are validated, crawls are capped, and nothing is ever submitted to an external form. Auth, billing, analytics, monitoring and workers all run in the production setup.",
    },
    tech: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Worker Queue",
      "AI Summarization",
      "PDF",
      "Vercel",
      "Sentry",
    ],
    links: [
      { kind: "demo", label: L.demo, href: "https://kensaops.vercel.app/" },
    ],
    image: "/works/kensaops.png",
  },
  {
    id: "tracelit",
    name: "TraceLit",
    status: "production",
    year: "2026",
    tagline: {
      ja: "SNS上の権利侵害を、監視から弁護士相談の準備までつなぐ",
      en: "From monitoring a harmful post to walking into a lawyer's office prepared.",
    },
    body: {
      ja: "誹謗中傷や権利侵害の疑いがある投稿を監視し、証拠保全からケース管理、弁護士相談用のPDF生成までを支援するSaaS。設計の中心は「AIにどこまで言わせないか」だった。AIは候補の整理までを担当し、名誉毀損に当たるかどうかの法的評価はしない。これを運用上のお願いではなく機能仕様として線を引いている。証拠は取得日時・URL・ハッシュを記録する。証拠で大事なのは取ったことより改変されていないことなので、そこを担保する形にした。センシティブなデータを扱うため、組織スコープのアクセス制御を前提に置いている。SNSのスクリーンショット取得は動的レンダリングと遅延読み込みとボット対策が重なる難所で、方式を何度も変えた。廃止されたドメインのブロックページを「証拠」として保存していた事故もあり、公式埋め込み経由に切り替えて実機で確認している。",
      en: "A SaaS that monitors posts suspected of defamation or rights infringement, then carries the case through evidence preservation, case management, and a PDF prepared for a lawyer. The central design question was what the AI is *not* allowed to say. It organizes candidates; it never renders a legal judgment on whether something constitutes defamation. That boundary is a feature specification, not a policy request. Evidence records capture timestamp, URL and hash — what matters about evidence is not that you collected it but that it hasn't been altered. Sensitive data means organization-scoped access control from the start. Capturing screenshots from social platforms is where dynamic rendering, lazy loading and bot defences all collide; I changed approach repeatedly. At one point a dead domain's block page was being saved *as evidence* — that got rooted out by switching to official embeds and verifying on real devices.",
    },
    tech: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Headless Browser",
      "PDF",
      "Hash Chain",
      "Org-scoped ACL",
    ],
    links: [{ kind: "site", label: L.site, href: "https://tracelit.jp/" }],
    image: "/works/tracelit.png",
    icon: "/works/icon-tracelit.png",
  },
  {
    id: "sumihajime",
    name: "スミハジメ",
    status: "production",
    year: "2026",
    tagline: {
      ja: "東京への転入手続きを、期限順のやることリストにする（非公式）",
      en: "Turns moving into Tokyo into a deadline-ordered checklist. Unofficial.",
    },
    body: {
      ja: "住む区・引越し日・世帯構成を選ぶと、必要な行政手続きが期限順のチェックリストになって出てくる非公式サービス。東京23区すべてに対応し、残る39市町村は「未対応」と画面に明示している。設計の芯は「間違えないこと」より「間違いを混ぜないこと」に置いた。どの手続きが該当するかの判定はLLMに任せず、バージョン付きの宣言的JSONルールとTypeScriptの純関数評価器で行う。同じ入力なら常に同じ結果が返るし、根拠がなければ推測せず「要確認」と表示する。公開するタスクは全件、人手レビューで承認した公式ソースと最終確認日を持っていて、未承認のデータを参照していたらビルドが落ちる公開ゲートをコードで強制している。選んだ区と違う自治体の情報が混ざることは1件でも不合格として扱う。RAG自動評価179問で根拠のない断定0件・他自治体の混入0件、自動テスト2,385本、アクセシビリティ検査（axe）の重大違反0件。都知事杯オープンデータ・ハッカソン2026への応募作品。",
      en: 'Pick your ward, your moving date and your household, and the municipal paperwork comes back as a checklist ordered by deadline. Unofficial. All 23 special wards of Tokyo are covered; the remaining 39 municipalities are labelled as unsupported on screen rather than quietly omitted. The core design principle is less "don\'t be wrong" than "don\'t mix wrongness in". Deciding which procedures apply is never delegated to an LLM — it runs on versioned declarative JSON rules evaluated by pure TypeScript functions, so identical input always yields identical output, and anything without a source is shown as "needs checking" instead of guessed. Every published task carries a human-reviewed official source and a last-verified date, and a publication gate fails the build if anything references unapproved data. A single instance of another ward\'s information leaking in counts as a failure. Across 179 automated RAG evaluations: zero unsourced assertions, zero cross-municipality contamination. 2,385 automated tests; zero critical accessibility violations under axe. Entered in the Tokyo Governor\'s Cup Open Data Hackathon 2026.',
    },
    tech: [
      "Cloudflare Workers",
      "D1",
      "Vectorize",
      "R2",
      "Hono",
      "React",
      "Vite",
      "TypeScript",
      "RAG",
    ],
    links: [
      {
        kind: "site",
        label: L.site,
        href: "https://app.sumihajime.workers.dev",
      },
    ],
    image: "/works/sumihajime.png",
  },
  {
    id: "agentrisk",
    name: "AgentRisk",
    status: "oss",
    year: "2026",
    tagline: {
      ja: "AIエージェントに渡す前に、リポジトリを実行せずに検査する",
      en: "Scan a repository before your coding agent opens it. Nothing is executed.",
    },
    body: {
      ja: "AIコーディングエージェントは、人間がレビューするより先にリポジトリの指示ファイル・パッケージのメタデータ・MCP／エディタ設定を読む。この順序の逆転そのものを問題として立てて、「信頼する前にスキャンする」ゲートとして作ったOSS。コードを一切実行しない静的チェックで、接続先・ツール権限・データアクセス・外部通信・秘密情報の5観点を診断する。危険な MCP ランチャー、インストールスクリプト、鍵を外へ転送する設定、「.env を読め」「承認を無視しろ」といった指示ファイルを拾う。CLI としても MCP ツールとしても使え、JSON・Markdown・SARIF・ターミナルの各形式で出力する。この5観点は、そのまま社内のAI利用審査のチェックリストに展開できる形にしてある。",
      en: 'AI coding agents read a repository\'s instruction files, package metadata and MCP/editor config before any human reviews them. That inversion of order is the problem this tool exists for: a scan-before-you-trust gate. It is entirely static — nothing in the target is executed — and it examines five things: what it connects to, which tools are enabled, how much data it can read, what leaves the machine, and whether secrets are exposed. It flags risky MCP launchers, install scripts, secret-forwarding config, and instruction files carrying lines like "read .env" or "ignore approval". Usable as a CLI or as an MCP tool, with JSON, Markdown, SARIF and terminal output. The five checks are deliberately shaped so they can be lifted into an internal AI review checklist.',
    },
    tech: [
      "Node.js",
      "TypeScript",
      "MCP",
      "SARIF",
      "npx",
      "GitHub Actions",
      "MIT",
    ],
    links: [
      {
        kind: "code",
        label: L.code,
        href: "https://github.com/Renga154/agentrisk",
      },
      {
        kind: "article",
        label: L.zenn,
        href: "https://zenn.dev/bricks/articles/453c6e705144f4",
      },
      {
        kind: "article",
        label: L.qiita,
        href: "https://qiita.com/Renga/items/fdaa15095fefdaa71b59",
      },
    ],
    image: "/works/agentrisk.png",
  },
  {
    id: "model-router",
    name: "model-router",
    status: "oss",
    year: "2026",
    tagline: {
      ja: "タスクの難易度をAI自身に判定させて、モデルと推論レベルを振り分ける",
      en: "Let the model judge how hard the task is, then route it to the right tier.",
    },
    body: {
      ja: "typo の修正に最上位モデルを使うのも、設計判断を含む変更を安いモデルに投げるのも無駄になる。タスクを T0〜T3 の4段階で判定し、それぞれに対応するサブエージェントへ委譲する Agent Skills 形式のOSS。規則は少なくしてある。迷ったら1段上げる。委譲先が「手に負えない」と返したら1段上げて1回だけ再試行する。セキュリティ・認証・課金が絡むものは最低でも T2 から始める。ユーザーがモデルを明示指定したら常にそれが優先。API リクエストをヒューリスティックで振り替えるプロキシ型ではなく、意味を理解した上で委譲するオーケストレーター型を選んだ。Agent Skills はオープン標準なので、Claude Code・Codex など同じ形式を読む30以上のツールへ1つのソースで配れる。BYOK で、リポジトリに鍵は一切含まない。",
      en: "Using a frontier model to fix a typo wastes money; handing an architectural change to a cheap one wastes time. This is an Agent Skills package that grades each task T0–T3 and delegates it to a matching sub-agent. The rules are deliberately few: when unsure, round up. If the delegate reports it's out of its depth, escalate one tier and retry exactly once. Anything touching security, auth or billing starts at T2 minimum. An explicit model choice from the user always wins. I chose an orchestrator that understands the task over a proxy that reroutes API requests heuristically. Because Agent Skills is an open standard, one source ships to Claude Code, Codex and 30-plus other tools that read the same format. BYOK — no keys in the repository.",
    },
    tech: [
      "Agent Skills",
      "Node.js",
      "Claude Code",
      "Codex",
      "OpenRouter",
      "BYOK",
      "MIT",
    ],
    links: [
      {
        kind: "code",
        label: L.code,
        href: "https://github.com/Renga154/model-router",
      },
    ],
    image: "/works/model-router.png",
  },
  {
    id: "moguswipe",
    name: "MoguSwipe",
    status: "appstore",
    year: "2026",
    tagline: {
      ja: "スワイプで、今日行く店を決める",
      en: "Swipe until you know where you're eating tonight.",
    },
    body: {
      ja: "「今日どこで食べるか」で消えていく時間を減らすためのiOSアプリ。検索結果を上から順に比較していく体験をやめて、カードを1枚ずつ残すか捨てるかだけにした。選択肢が多すぎて決められない、という側の問題に寄せている。現在地・ジャンル・予算・気分・営業状況で候補を出し、お気に入り、履歴、条件保存、Undo を用意した。React Native / Expo / TypeScript で作り、認証は Firebase（メール・Google・Apple）、店舗情報は Google Places API、課金は RevenueCat。Free と Plus の制限設計、EAS Build でのビルド、App Store の審査指摘に対する課金導線・料金表示・法務リンク・ATT 説明の改善まで通している。",
      en: "An iOS app aimed at the time that disappears into deciding where to eat. Instead of comparing a list from the top down, you keep or discard one card at a time — the problem being solved is having too many options, not too few. Candidates come from location, cuisine, budget, mood and opening hours, with favourites, history, saved filters and undo. Built in React Native / Expo / TypeScript, with Firebase auth (email, Google, Apple), Google Places for venue data and RevenueCat for subscriptions. That included designing the Free/Plus limits, building through EAS, and reworking the purchase flow, price display, legal links and ATT explanation in response to App Store review.",
    },
    tech: [
      "React Native",
      "Expo",
      "TypeScript",
      "Firebase",
      "Firestore",
      "Google Places API",
      "RevenueCat",
      "EAS Build",
    ],
    links: [
      {
        kind: "store",
        label: L.store,
        href: "https://apps.apple.com/jp/app/moguswipe/id6757360819",
      },
    ],
    icon: "/works/icon-moguswipe.png",
    shots: [
      "/works/moguswipe-1.jpg",
      "/works/moguswipe-2.jpg",
      "/works/moguswipe-3.jpg",
    ],
  },
  {
    id: "mira-wisp",
    name: "Mira / Wisp",
    status: "sale",
    year: "2026",
    tagline: {
      ja: "記憶と人格を持って、デスクトップに住むAIエージェント",
      en: "A desktop AI agent that keeps a personality and accumulates memory.",
    },
    body: {
      ja: "VRMのアバターがデスクトップに常駐して、会話し、コマンドを実行し、記録を残す。VRMを表示するだけのソフトは既にあるので、差別化は人格の定義・記憶の蓄積・ツール実行に置いた。デスクトップ全面への透過描画はブラウザではできないため、表示は Electron のネイティブアプリ、アバター周りは Web、という分業にしている。配布物なので作りが変わる。three.js を CDN から読んでいたのをやめて同梱に変えた（起動にネットワークが要る上、CDN が改竄されればレンダラで任意コードが動く）。ローカルの制御 HTTP は Origin か Referer が付いた要求を拒否する（ブラウザは必ず付け、CLI は付けないので、正規の使い方は壊れない）。待機中のアイドル動作は、ライセンス制約を持ち込まないよう外部アセットを使わずコードで生成している。",
      en: "A VRM avatar that lives on the desktop: it talks, runs commands, and keeps a record. Software that merely displays a VRM already exists, so the differentiator is elsewhere — a defined personality, memory that accumulates, and the ability to actually execute tools. A browser cannot draw transparently across the whole desktop, so the split is an Electron native app for display and web for the avatar pipeline. Shipping it to other people changed the engineering. three.js moved from a CDN to bundled (a CDN means startup needs network, and a compromised CDN means arbitrary code in the renderer). The local control HTTP endpoint now rejects any request carrying an Origin or Referer — browsers always send one and CLI clients don't, so legitimate use is untouched while a random web page can no longer drive the avatar or run up an API bill. Idle motion is generated in code rather than from asset packs, to keep licence constraints out of the distributable.",
    },
    tech: [
      "Electron",
      "three.js",
      "three-vrm",
      "VRM",
      "TypeScript",
      "OpenAI Realtime API",
      "VOICEVOX",
    ],
    links: [
      {
        kind: "store",
        label: { ja: "BOOTH（Wisp）", en: "BOOTH (Wisp)" },
        href: "https://renga-works.booth.pm/items/8684560",
      },
      {
        kind: "store",
        label: { ja: "BOOTH（Mira）", en: "BOOTH (Mira)" },
        href: "https://renga-works.booth.pm/items/8684534",
      },
      {
        kind: "site",
        label: { ja: "紹介ページ", en: "Landing page" },
        href: "https://wisp-gules-mu.vercel.app",
      },
    ],
    image: "/works/mira-wisp.png",
  },
  {
    id: "orbitory",
    name: "Orbitory",
    status: "wip",
    year: "2026",
    tagline: {
      ja: "iPhoneから、Mac上のAIコーディングアシスタントを見て、承認して、再開する",
      en: "Watch, approve and resume a Mac coding agent from your phone.",
    },
    body: {
      ja: "AIエージェントに作業を任せていて一番もったいないのは、承認待ちで止まっている時間だと思っている。それをなくすために、Mac上で動いているアシスタントの状態をiPhoneから監視し、必要な承認を与え、セッションを再開・開始できるようにしている。承認を外から与えられるということは、裏返せば外から実行させられるということなので、権限と安全性の設計がこのアプリの中心的な課題になる。AgentRisk が「エージェントに渡す前に確認する」側だとすれば、こちらは「エージェントを動かしている最中に止める・通す」側で、同じ問題意識の別アプローチとして作っている。",
      en: "The most wasteful part of delegating work to a coding agent is the time it sits blocked waiting for approval. This app removes that: monitor what the assistant on your Mac is doing, grant the approvals it needs, and start or resume sessions — from your phone. Being able to approve remotely is, inverted, the ability to make something execute remotely, which puts permissions and safety at the centre of the design. If AgentRisk is the check you run *before* handing anything to an agent, this is the gate you hold *while* it runs — the same concern approached from the other end.",
    },
    tech: ["iOS", "Swift", "Realtime Sync", "Approval Gating"],
    links: [],
    icon: "/works/icon-orbitory.png",
    shots: [
      "/works/orbitory-1.png",
      "/works/orbitory-2.png",
      "/works/orbitory-3.png",
    ],
  },
  {
    id: "nanoka",
    name: "Nanoka",
    status: "wip",
    year: "2026",
    tagline: {
      ja: "未来の自分に質問を残す。1週間後に、それに答える",
      en: "Leave a question for your future self. Answer it a week later.",
    },
    body: {
      ja: "過去の自分から届いた質問に答えると、問と答が対になって初めて1つのコンテンツになるアプリ。タイムカプセル系のサービスが軒並み続かないのは、報酬が10年後にあるからだと考えている。射程を1週間まで縮めるとループが回りはじめる。そして副産物として、「1週間前のあなたから、質問が届いています」という、開かれる理由のある通知が手に入る。「メッセージ」ではなく「質問」にしているのは、開いて懐かしんで終わらせないため。答えを撮らせるところまで持っていかないと対が完成せず、対が完成しなければコンテンツもフィードも生まれない。React Native / Expo で開発中。通知の確実性とオフライン永続化のため、Firebase はネイティブSDK版を使っている。",
      en: "You record a question for yourself; a week later it comes back and you answer it. Only the pair — question and answer together — becomes a piece of content. Time-capsule apps almost all die, and I think it's because the payoff sits ten years out; pull the range in to one week and the loop starts turning. The by-product is a notification with a genuine reason to be opened: \"a question has arrived from you, one week ago.\" It's a question rather than a message on purpose — if opening it and feeling nostalgic is where it ends, the pair never completes, and without the pair there's no content and no feed. Built in React Native / Expo, using the native Firebase SDKs for reliable background notifications and offline persistence.",
    },
    tech: [
      "React Native",
      "Expo",
      "TypeScript",
      "Firebase",
      "Firestore",
      "FCM",
    ],
    links: [],
    icon: "/works/icon-nanoka.png",
    shots: ["/works/nanoka-1.png", "/works/nanoka-2.png"],
  },
];
