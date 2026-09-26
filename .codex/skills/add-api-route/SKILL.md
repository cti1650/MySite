---
name: add-api-route
description: src/pages/api/ にエンドポイントを追加・変更するときに使う。CORS の選び方(applyCors と applyPublicCors)、Host ヘッダを信用しない URL 組み立て、zod での入力検証、PII を出さないログ、createCachedFetcher とキャッシュヘッダの規約を案内する。「APIルートを追加」「エンドポイントを作る」「api/ を変更」などの文脈で使う。
---

# API ルートを追加する

手順の実体は `docs/agents/add-api-route.md`（リポジトリルートから）にあります。
**まずこのファイルを読み、その内容に従ってください。**

このリポジトリには過去のセキュリティ監査で入れた約束があります。API ルートは
その約束に最も関わる場所なので、`AGENTS.md` の「セキュリティ上の約束」も
必ず読んでください。

playbook を更新する場合は `docs/agents/add-api-route.md` を直してください
（このファイルは入口なので手順を複製しません）。
