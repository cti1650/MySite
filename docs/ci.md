# CI

GitHub Actions で実行しています。設定は [.github/workflows/ci.yml](../.github/workflows/ci.yml) です。

## 実行タイミング

| イベント | 対象 |
| --- | --- |
| `pull_request` | 全ブランチ（同一PRへの連続 push では古い実行を打ち切る） |
| `push` | `main` のみ |

## 検査内容

[Lefthook](https://lefthook.dev/) の `pre-push` と同じ検査を CI 側でも再実行します
（`--no-verify` でのすり抜けを防ぐため）。加えてビルドの成否も確認します。

| ステップ | コマンド |
| --- | --- |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Secretlint | `git ls-files` で列挙した全ファイルを `--maskSecrets` 付きで検査 |
| Audit | `npm audit --audit-level=high` |
| Build | `npm run build` |

Node.js は 24 系、依存のインストールは `npm ci` です。

すべてのページが `getServerSideProps` のみを使っており、ビルド時に外部APIを呼ばないため、
CI では Notion / Qiita のトークンを必要としません。

## アクションのバージョン固定

`uses` はすべて commit SHA で固定しています。タグは後から付け替えられるため、
タグ参照では同じワークフローが別のコードを実行しうるためです。
末尾にバージョンをコメントで残しています。

```yaml
uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
```

SHA の追従は手動では行わず、[.github/dependabot.yml](../.github/dependabot.yml) の
`github-actions` エコシステムに任せています（月次、1PRにまとめて更新）。Dependabot は
SHA と末尾のバージョンコメントの両方を書き換えます。

## Dependabot PR の自動マージ

[.github/workflows/dependabot-auto-merge.yml](../.github/workflows/dependabot-auto-merge.yml) で、
Dependabot の PR に auto-merge を設定します。CI が通った時点で squash merge されます。

自動マージの対象は `github-actions` エコシステムの更新のみです
（`dependabot/fetch-metadata` の `package-ecosystem` 出力で判定）。将来 `npm` 等を
dependabot.yml に追加しても、それらは自動マージされません。

Dependabot の PR は fork 扱いとなり `pull_request` では読み取り専用トークンしか
得られないため、`pull_request_target` を使っています。PR のコードは checkout せず
マージ操作のみを行うため、未検証のコードは実行されません。

### 前提となるリポジトリ設定

| 設定 | 値 | 理由 |
| --- | --- | --- |
| Allow auto-merge | 有効 | 無効だと `gh pr merge --auto` が失敗する |
| `main` のブランチ保護 | `ci` を必須チェックに指定 | 必須チェックがないと CI 完了を待たず即マージされる |
| `enforce_admins` | 無効 | 管理者は `main` へ直接 push できる状態を維持するため |
| `strict`（最新化の強制） | 無効 | `main` に対して古いだけで PR がブロックされ、rebase が繰り返されるのを避けるため |

## 権限

CI は `GITHUB_TOKEN` を `contents: read` のみに絞っています。
自動マージのワークフローはマージ操作のため `contents: write` /
`pull-requests: write` を持ちます。
