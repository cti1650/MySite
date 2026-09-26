# AGENTS.md

コーディングエージェント向けのプロジェクト指示です。Codex CLI はこのファイルを自動で読みます。
Claude Code は [CLAUDE.md](CLAUDE.md) 経由でこのファイルを読み込みます。

人間向けの説明は [README.md](README.md) と [docs/](docs/) にあります。重複させないため、
ここには「エージェントが判断を誤りやすい点」だけを書きます。

## プロジェクト概要

Next.js 15（Pages Router）の個人ポートフォリオサイト。Notion / Qiita / Zenn から
データを取得し、Vercel で `main` から自動デプロイされます。

全ページが `getServerSideProps` のみを使い、`getStaticProps` / `getStaticPaths` は
**使いません**。ビルド時に外部APIを呼ばないため、ビルドにAPIトークンは不要です。

## コマンド

| 目的 | コマンド |
| --- | --- |
| 型チェック | `npm run typecheck` |
| Lint / Format チェック | `npm run lint` |
| 自動修正 | `npm run fix` |
| テスト | `npm test` |
| ビルド | `npm run build` |

変更後は最低限 `npm run lint` と `npm test` を通してください。型に触れた場合は
`npm run typecheck`、依存やビルド設定に触れた場合は `npm run build` も実行します。

## パッケージ管理

- **npm を使います**（yarn / pnpm は使いません）
- インストールはグローバル `~/.npmrc` が指すセキュリティプロキシ経由で行われます。
  **`--registry` で上書きしないでください。** lockfile には `registry.npmjs.org` が
  書かれる正常な状態です
- `package.json` のバージョン指定は `^` のまま広く保ちます。不要に固定しないでください

## コードの規約

- Lint / Format は [Biome](https://biomejs.dev/) です。ESLint / Prettier は使いません
- インポートのパスエイリアスは `@lib/*` `@comp/*` `@hooks/*` `src/*`
  （定義は [tsconfig.json](tsconfig.json)）
- コメントは日本語。「何をしているか」ではなく**なぜそうしたか**を書きます。
  既存コードのコメント密度に合わせ、自明な処理には書きません

## コミット

- [Conventional Commits](https://www.conventionalcommits.org/) 形式（`<type>: <subject>`）
- 件名・本文は日本語で書けます
- Git フックは [Lefthook](https://lefthook.dev/) が管理します。詳細は
  [docs/git-hooks.md](docs/git-hooks.md)
- **`--no-verify` / `LEFTHOOK=0` でフックを飛ばさないでください。** 同じ検査は
  CI でも走るため、飛ばしても後で落ちます

## セキュリティ上の約束（変更時に壊さないこと）

この4点は過去のセキュリティ監査で入れたものです。触る場合は
[テスト](docs/testing.md)が対応する契約を固定しているので、テストを先に読んでください。

1. **Host ヘッダを信用しない** — 公開ドメインの判定は
   [src/lib/siteUrl.ts](src/lib/siteUrl.ts) の許可リストを通します。
   `req.headers.host` を直接URLに埋め込まないでください
2. **CORS でワイルドカードを返さない** — [src/lib/cors.ts](src/lib/cors.ts) の
   `applyCors` は許可ドメインのOriginのみ反射します。誰でも読める公開エンドポイント
   だけが `applyPublicCors`（`*`）を使います
3. **ログにPIIを出さない** — [src/lib/logger.ts](src/lib/logger.ts) の
   `logSecurityEvent` には氏名・メールアドレス・問い合わせ本文を渡しません。
   件数・理由などの非識別情報のみ
4. **外部データの改行を潰す** — llms.txt 等の行構造を持つ出力に外部由来の文字列を
   入れる場合は改行を除去します（[src/lib/llmsContent.ts](src/lib/llmsContent.ts) の
   `flatten`、メールヘッダは `sanitizeHeaderValue`）

## 環境変数

`.env.local` に置きます。一覧は [docs/environment-variables.md](docs/environment-variables.md)。

**[src/lib/siteUrl.ts](src/lib/siteUrl.ts) と [src/lib/gtag.ts](src/lib/gtag.ts) は
`process.env` をモジュール読み込み時に評価します。** テストで環境変数を変える場合は
`vi.resetModules()` の後に動的 import が必要です。

## 作業手順（playbook）

具体的な手順は以下にあります。エージェントのスキルからも参照されます。

| 作業 | playbook |
| --- | --- |
| テストを追加する | [docs/agents/add-test.md](docs/agents/add-test.md) |
| API ルートを追加する | [docs/agents/add-api-route.md](docs/agents/add-api-route.md) |
| 依存更新PRを評価する | [docs/agents/review-dependency-update.md](docs/agents/review-dependency-update.md) |

## やらないこと

- `main` への直接 push（ブランチ保護で `ci` が必須チェックです。作業はブランチ＋PRで）
- 新しい依存の追加を気軽に行うこと。まず標準機能と既存の依存で解けないか検討します
- テストのためにプロダクションコードの設計を変えること
