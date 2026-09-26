# エージェント向け playbook

コーディングエージェント（Claude Code / Codex CLI）が参照する作業手順です。
人間が読んでも意味が通るように書いてあります。

| playbook | 内容 |
| --- | --- |
| [add-test.md](add-test.md) | テストの追加。Vitest の落とし穴（環境変数の評価タイミング等） |
| [add-api-route.md](add-api-route.md) | API ルートの追加。CORS・検証・ログ・キャッシュの規約 |
| [review-dependency-update.md](review-dependency-update.md) | 依存更新PRの評価手順と適用順 |

## なぜこの場所にあるか

Claude Code は `.claude/skills/`、Codex CLI は `.codex/skills/` からスキルを探します。
両方のスキルは**このディレクトリの playbook を読むだけの薄いラッパー**で、
手順の実体はここにあります。

```
docs/agents/add-test.md          ← 手順の実体（ここを直す）
├── .claude/skills/add-test/SKILL.md   ← Claude Code 用の入口
└── .codex/skills/add-test/SKILL.md    ← Codex CLI 用の入口
```

**手順を変更するときは docs/agents/ 側を直してください。** スキル側は入口なので、
名前や説明（フロントマター）を変える場合だけ触ります。

プロジェクト全体の指示は [../../AGENTS.md](../../AGENTS.md) にあります。
