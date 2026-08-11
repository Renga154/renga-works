# Renga Works — ポートフォリオサイト

作った9本のプロダクトと技術記事を1ページにまとめた個人サイト。SNS のプロフィール欄から飛ぶ先として作っているので、**職務経歴書ではない**（所属・学歴・業務数値は載せない）。

Next.js 16 (App Router) / TypeScript / Tailwind v4 / React Three Fiber。

## 動かす

```bash
npm install && npm run dev
```

本番相当で確認するとき:

```bash
npm run build && npm start
```

## 中身の場所

| やりたいこと | 触るファイル |
|---|---|
| 作品を足す・直す | `src/content/works.ts` |
| 記事を足す | `src/content/articles.ts` |
| 自己紹介・SNSリンク | `src/content/profile.ts` |
| 技術スタック | `src/content/stack.ts` |
| UI の文言（日英） | `src/lib/i18n.tsx` の `ui` |
| 配色・背景 | `src/app/globals.css` の `@theme` |
| 公開ドメイン | `src/lib/site.ts` |

日英はルーティングを分けず、`{ ja, en }` の組を `useLang()` で出し分けている。**新しい文言を足すときは必ず両方書く**（型で強制される）。

## 作品の画像

`public/works/` に実素材が入っている。`WorkThumb.tsx` は `works.ts` の指定を見て3通りに描き分ける:

| 指定 | 表示 | 使っている作品 |
|---|---|---|
| `image` | 横長キャプチャを全面表示 | KensaOps / TraceLit / AgentRisk / model-router / Mira・Wisp |
| `icon` + `shots` | 端末スクショ3枚を重ねて並べ、左下にアプリアイコン | Koeha / MoguSwipe / Orbitory |
| `icon` のみ | アイコンを中央に配置 | Nanoka |

差し替えるときは `public/works/` にファイルを置いて `works.ts` のパスを変えるだけ。**画像の合成はコンポーネント側でやっている**ので、1枚に焼き込んだ素材を作り直す必要はない。

素材の作り直し方（参考）:

```bash
# 稼働中のサイト / GitHub のページを撮る（GitHub はダークテーマで撮れる）
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --hide-scrollbars --force-dark-mode --window-size=1440,900 \
  --virtual-time-budget=12000 --screenshot=out.png "https://example.com"

# 幅を詰める（横長は1280、端末スクショは420、アイコンは256）
sips -Z 1280 out.png --out public/works/xxx.png
```

リポジトリ内の素材は約2.1MBあるが、配信は `next/image` が WebP に変換して**全作品ぶんで約173KB**。しかも全部 lazy 読み込みなので初期表示には乗らない。

## 背景の 3D について

Hero の裏で動いているのはノードとその接続を描いた WebGL のシーン（`src/components/three/`）。**装飾ではなく、AgentRisk・model-router・Orbitory が扱っている「エージェントの接続と権限」というモチーフに合わせている。**

軽さは構造で担保している:

- three.js は初期バンドルに入らない。`next/dynamic` + `ssr:false` で分離し、**LCP が確定したあと**（`requestIdleCallback`）に読み込む
- 次のいずれかに当たる環境では**そもそも読み込まない**: `prefers-reduced-motion: reduce` / Save-Data / 2G / CPU 4コア未満 / メモリ4GB未満 / WebGL 非対応
- 描画は DPR 1.5 上限、Hero が画面外・タブが非表示のあいだは停止
- 実測 FPS が 30 を 2 秒連続で下回ったらノード数を落とし、最低ティアでも足りなければ Canvas を破棄して静的背景に戻る

**静的背景（`globals.css` の `.backdrop-static`）は 3D のフォールバックではなく土台。** 3D が一度も来なくても完成して見える状態を先に作ってあるので、上のどの経路を通っても破綻しない。

### 3D の見え方を調整したい場合

- ノードの大きさ: `AgentNetwork.tsx` の `gl_PointSize` の係数（現在 `60.0`）
- 明るさ: 同ファイルのノード側 `uOpacity * 0.6`、線側 `0.09 + pulse * 0.55`
- 密度: `Scene.tsx` の `TIERS`

## 計測値（本番ビルド, gzip）

| 項目 | 実測 |
|---|---|
| 初期転送（HTML+JS+CSS+font+画像） | 約 309 KB |
| うち Next.js/React のフレームワーク分 | 約 171 KB |
| うち自前のアプリコード | 約 38 KB |
| three.js チャンク | 230 KB（**遅延・初期表示をブロックしない**） |
| アバター画像 | 11.8 KB（`next/image` 経由） |
| Works の画像 全9作品ぶん | 173 KB（WebP・**全て lazy**） |
| 外部ホストへのリクエスト | 0 |

## デプロイ

Vercel。**公開URLの設定は不要**で、そのままデプロイしてよい。

`src/lib/site.ts` はドメインをハードコードせず、この順で解決する:

1. `NEXT_PUBLIC_SITE_URL`（明示的に上書きしたいとき）
2. `VERCEL_PROJECT_PRODUCTION_URL`（Vercel が毎ビルド自動で入れる。カスタムドメインがあればそれ、無ければ `*.vercel.app`）
3. `http://localhost:3000`（`next dev` 用）

つまり**後からカスタムドメインを付けても、次のデプロイで canonical・OGP・sitemap・robots が勝手に追従する**。コード変更は要らない。

こうしてある理由: canonical が「自分が配信していないドメイン」を指していると、検索エンジンに正規版が別にあると伝わってサイトが評価されず、OGP画像も404になって SNS のカードが壊れる。1行を書き換え忘れるだけでこれが起きるので、書き換え自体を無くした。

> Vercel 側で **Settings → Environment Variables → “Enable access to System Environment Variables”** が有効である必要がある（新規プロジェクトは既定で有効）。

OGP 画像は `src/app/opengraph-image.tsx` がビルド時に生成する。
