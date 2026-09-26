# CLAUDE.md

プロジェクトの指示は [AGENTS.md](AGENTS.md) に集約しています。Codex CLI と共用するため、
内容をこちらに複製せず取り込みます。

@AGENTS.md

## Claude Code 固有の補足

### スキル

`.claude/skills/` にプロジェクト用のスキルがあります。中身は
[docs/agents/](docs/agents/) の playbook で、Codex CLI 用の `.codex/skills/` と
同じものを参照します。**playbook を直すときは docs/agents/ 側を直してください。**

| スキル | 使う場面 |
| --- | --- |
| `add-test` | テストを追加・修正するとき |
| `add-api-route` | `src/pages/api/` にエンドポイントを追加するとき |
| `review-dependency-update` | Dependabot の PR を評価するとき |

### サブエージェント

`.claude/agents/migration-impact-analyzer.md` は、依存ライブラリのメジャー更新が
このコードベースのどこに影響するかを調べる読み取り専用エージェントです。
Codex CLI にはプロジェクト単位でサブエージェントを定義する仕組みがないため、
これは Claude Code 専用です。同じ判断材料は
[docs/agents/review-dependency-update.md](docs/agents/review-dependency-update.md)
にもあるので、Codex 側ではそちらを使ってください。
