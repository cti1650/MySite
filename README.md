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
cp .env.example .env.local  # 値は下記を参考に設定
npm run dev
```

### 環境変数

| 変数名 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 本番URL (sitemap.xml 等で使用するカノニカルURL) |
| `ALLOWED_HOSTS` | 追加で公開するドメイン (カンマ区切り、`*.example.com` のワイルドカード可) |
| `NOTION_BACKEND_ENDPOINT` | Notion 取得用バックエンドのエンドポイント |
| `NOTION_KEY` | Notion API トークン |
| `NOTION_DATABASE_ID` | ポートフォリオDBのID |
| `NOTION_CONTACT_DATABASE_ID` | お問い合わせ保存先DBのID |
| `QIITA_ACCESS_TOKEN` | Qiita 記事取得用トークン |
| `YOUR_ZENN_USERNAME` | Zenn ユーザー名 |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | GA 測定ID (任意) |

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
| `npm run audit` | 依存パッケージの脆弱性チェック |
| `npm run secretlint` | リポジトリ全体のシークレット混入チェック |
| `npm run commitlint` | コミットメッセージの形式チェック |

## Git フック

[Lefthook](https://lefthook.dev/) で pre-commit / commit-msg / pre-push を管理しています。
`npm ci` / `npm install` 時に自動インストールされます。
コミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/) 形式です。

フック一覧・資格情報検査の詳細・スキップ方法は [docs/git-hooks.md](docs/git-hooks.md) を参照してください。

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
└── git-hooks.md  # Git フック / 資格情報検査
```

## LLM 対応

LLMクローラー向けに以下のエンドポイントを提供しています:

- [`/llms.txt`](https://cti1650-portfolio-site.vercel.app/llms.txt) — サイト概要・プロフィール・参照先リスト
- [`/llms-full.txt`](https://cti1650-portfolio-site.vercel.app/llms-full.txt) — 上記 + ポートフォリオ一覧 + 記事一覧を1ファイルに連結
- [`/llms/portfolios.txt`](https://cti1650-portfolio-site.vercel.app/llms/portfolios.txt) — ポートフォリオ詳細
- [`/llms/contents.txt`](https://cti1650-portfolio-site.vercel.app/llms/contents.txt) — Qiita/Zenn 記事一覧
- [`/sitemap.xml`](https://cti1650-portfolio-site.vercel.app/sitemap.xml)
- [`/robots.txt`](https://cti1650-portfolio-site.vercel.app/robots.txt) — 主要LLMクローラーを明示的に許可

## デプロイ

[Vercel](https://vercel.com/) で `main` ブランチから自動デプロイされます。

## ライセンス

ISC
