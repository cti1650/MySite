# 環境変数

`.env.local` に設定する環境変数の一覧です。設定例は [.env.example](../.env.example) を参照してください。

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
