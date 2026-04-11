# cti1650 Portfolio Site

[cti1650-portfolio-site.vercel.app](https://cti1650-portfolio-site.vercel.app/) のソースコードです。
個人で開発したプロジェクトと、Qiita/Zennで公開している技術記事をまとめたポートフォリオサイトです。

## 技術スタック

- [Next.js](https://nextjs.org/) 15 (Pages Router)
- React 18 / TypeScript 5
- [Tailwind CSS](https://tailwindcss.com/) 3
- [Mantine](https://mantine.dev/) 8
- [Biome](https://biomejs.dev/) (lint / format)
- データソース: Notion API / Qiita API / Zenn API

## セットアップ

```bash
yarn install
cp .env.local.example .env.local  # 未配置の場合は下記を参考に作成
yarn dev
```

### 環境変数

| 変数名 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 本番URL (sitemap.xml 等で使用) |
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
| `yarn dev` | 開発サーバー起動 |
| `yarn build` | プロダクションビルド |
| `yarn start` | プロダクションサーバー起動 |
| `yarn lint` | Biome でのチェック |
| `yarn fix` | Biome での自動修正 |
| `yarn format` | Biome でのフォーマット |

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
