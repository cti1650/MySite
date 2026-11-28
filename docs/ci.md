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
| Test | `npm test`（Vitest / 詳細は [testing.md](testing.md)） |
| Secretlint | `git ls-files` で列挙した全ファイルを `--maskSecrets` 付きで検査 |
| Build | `npm run build` |

これらは `ci` ジョブで実行し、`ci` が `main` のブランチ保護の必須チェックです。

`npm audit --audit-level=high` は別の `audit` ジョブで実行し、必須チェックにはしていません。
audit の結果は PR の内容ではなく勧告の公開時期で変わるため、必須にすると無関係な PR
（自動マージ対象を含む）まで止まるためです。経緯は
[dependency-updates.md](dependency-updates.md#前提となるリポジトリ設定) を参照してください。

Node.js は 24 系、依存のインストールは `npm ci` です。

すべてのページが `getServerSideProps` のみを使っており、ビルド時に外部APIを呼ばないため、
CI では Notion / Qiita のトークンを必要としません。

## アクションのバージョン固定

`uses` はすべて commit SHA で固定しています。タグは後から付け替えられるため、
タグ参照では同じワークフローが別のコードを実行しうるためです。

```yaml
uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
```

SHA の追従と Dependabot PR の自動マージについては
[dependency-updates.md](dependency-updates.md) を参照してください。

## 権限

CI は `GITHUB_TOKEN` を `contents: read` のみに絞っています。
自動マージのワークフローはマージ操作のため `contents: write` /
`pull-requests: write` を持ちます。
