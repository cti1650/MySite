# cti1650 Portfolio Site

[cti1650-portfolio-site.vercel.app](https://cti1650-portfolio-site.vercel.app/) のソースコードです。
個人で開発したプロジェクトと、Qiita/Zennで公開している技術記事をまとめたポートフォリオサイトです。

## 技術スタック

- Node.js 24 以上 / npm (パッケージマネージャは npm に統一)
- [Next.js](https://nextjs.org/) 15 (Pages Router)
- React 18 / TypeScript 5
- [Tailwind CSS](https://tailwindcss.com/) 3
- [Mantine](https://mantine.dev/) 8
- [Biome](https://biomejs.dev/) (lint / format)
- [Lefthook](https://lefthook.dev/) (Git フック管理) / [secretlint](https://github.com/secretlint/secretlint) / [commitlint](https://commitlint.js.org/)
- データソース: Notion API / Qiita API / Zenn API

## セットアップ

```bash
npm ci
cp .env.example .env.local  # 値は docs/environment-variables.md を参考に設定
npm run dev
```

環境変数の一覧は [docs/environment-variables.md](docs/environment-variables.md) を参照してください。

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm start` | プロダクションサーバー起動 |
| `npm run lint` | Biome でのチェック |
| `npm run fix` | Biome での自動修正 |
| `npm run format` | Biome でのフォーマット |
| `npm run typecheck` | TypeScript の型チェック |
| `npm test` | Vitest でのテスト実行 |
| `npm run test:watch` | Vitest の監視実行 |
| `npm run test:coverage` | カバレッジ付きテスト |
| `npm run audit` | 依存パッケージの脆弱性チェック |
| `npm run secretlint` | リポジトリ全体のシークレット混入チェック |
| `npm run commitlint` | コミットメッセージの形式チェック |

## Git フック

[Lefthook](https://lefthook.dev/) で pre-commit / commit-msg / pre-push を管理しています。
`npm ci` / `npm install` 時に自動インストールされます。
コミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/) 形式です。

フック一覧・資格情報検査の詳細・スキップ方法は [docs/git-hooks.md](docs/git-hooks.md) を参照してください。

## テスト

Vitest + happy-dom で実行します。`npm test` で全件実行できます。
対象の選定方針は [docs/testing.md](docs/testing.md) を参照してください。

## CI

GitHub Actions で PR と `main` への push に対して lint / typecheck / test / secretlint / audit / build を実行します。
詳細は [docs/ci.md](docs/ci.md) を参照してください。

## 依存関係の更新

Dependabot で週次更新します。方針は [docs/dependency-updates.md](docs/dependency-updates.md) を参照してください。

## ディレクトリ構成

```
src/
├── pages/        # Next.js ページ / API Routes
│   └── api/
│       ├── llms/     # llms.txt 関連エンドポイント
│       └── sitemap.xml.ts
├── components/   # UIコンポーネント
├── lib/          # 外部API連携 (Notion/Qiita/Zenn)
├── hooks/        # カスタムフック
└── types/        # 型定義

docs/
├── agents/                   # エージェント向け playbook
├── ci.md                     # GitHub Actions CI
├── dependency-updates.md     # Dependabot / バージョン固定
├── environment-variables.md  # 環境変数一覧
├── git-hooks.md              # Git フック / 資格情報検査
├── llms.md                   # LLM対応エンドポイント一覧
└── testing.md                # Vitest / テスト方針
```

## LLM 対応

LLMクローラー向けに `/llms.txt` 等のエンドポイントを提供しています。詳細は [docs/llms.md](docs/llms.md) を参照してください。

## コーディングエージェント

Claude Code と Codex CLI の両方で使える設定をリポジトリに含めています。
指示の実体は [AGENTS.md](AGENTS.md) の1ファイルで、[CLAUDE.md](CLAUDE.md) が
それを取り込みます。作業手順は [docs/agents/](docs/agents/) にあり、
`.claude/skills/` と `.codex/skills/` の両方から参照されます。

## デプロイ

[Vercel](https://vercel.com/) で `main` ブランチから自動デプロイされます。

## ライセンス

ISC
