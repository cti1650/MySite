---
name: add-test
description: このリポジトリにテストを追加・修正するときに使う。Vitest + happy-dom の規約と、実際に踏んだ落とし穴（環境変数をモジュール読み込み時に評価するモジュール、1テスト内での複数描画、日付固定、パスエイリアスの手動同期）を案内する。「テストを書いて」「テストを追加」「vitest」「カバレッジ」などの文脈で使う。
---

# テストを追加する

手順の実体は [docs/agents/add-test.md](../../../docs/agents/add-test.md) にあります。
**まずこのファイルを読み、その内容に従ってください。**

補助的に次も参照します。

- [docs/testing.md](../../../docs/testing.md) — 対象の選定方針と既存テストの一覧
- [AGENTS.md](../../../AGENTS.md) — プロジェクト全体の規約

playbook を更新する場合は `docs/agents/add-test.md` を直してください
（このファイルは入口なので手順を複製しません）。
