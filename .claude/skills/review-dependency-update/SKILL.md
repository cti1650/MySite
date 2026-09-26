---
name: review-dependency-update
description: Dependabot などの依存更新PRを評価するときに使う。ローカルで当てて test/typecheck/build の4点を確認する手順、更新対象ごとにどのテストが効くか、複数の major が待機している場合の適用順、グループの update-types が更新を止めない仕様を案内する。「dependabotのPRを確認」「依存を更新して大丈夫か」「このPRをマージしていいか」などの文脈で使う。
---

# 依存更新PRを評価する

手順の実体は [docs/agents/review-dependency-update.md](../../../docs/agents/review-dependency-update.md)
にあります。**まずこのファイルを読み、その内容に従ってください。**

補助的に次も参照します。

- [docs/dependency-updates.md](../../../docs/dependency-updates.md) — Dependabot の設定と方針
- [docs/testing.md](../../../docs/testing.md) — どのテストが何を守っているか

`npm test` だけで判断しないでください。型定義の変更は `npm run typecheck`、
ビルド設定の変更は `npm run build` でしか落ちません。

playbook を更新する場合は `docs/agents/review-dependency-update.md` を直してください
（このファイルは入口なので手順を複製しません）。
