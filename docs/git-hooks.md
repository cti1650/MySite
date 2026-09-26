# Git フック

[Lefthook](https://lefthook.dev/) で管理しています。設定は [lefthook.yml](../lefthook.yml) です。

## インストール

`npm ci` / `npm install` 時に `prepare` スクリプト経由で自動インストールされます。
手動で入れ直す場合は以下を実行してください。

```bash
npx lefthook install
```

## フック一覧

| フック | コマンド | 内容 |
| --- | --- | --- |
| `pre-commit` | `biome` | ステージ済みファイルに Biome の自動修正を適用し、修正結果を再ステージ (`stage_fixed`) |
| `pre-commit` | `secretlint` | ステージ済みファイルのシークレット混入チェック |
| `commit-msg` | `commitlint` | コミットメッセージの形式チェック |
| `pre-push` | `typecheck` | `tsc --noEmit` |
| `pre-push` | `lint` | `biome check .` |
| `pre-push` | `secretlint` | Git 追跡下の全ファイルを対象に資格情報混入を再チェック |
| `pre-push` | `audit` | `npm audit --audit-level=high` で dependencies の脆弱性・悪性パッケージ勧告をチェック |

各フック内のコマンドは `parallel: true` で並列実行されます
(`commit-msg` はコマンドが1つのため指定なし)。

## コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) 形式で記述します。設定は
[.commitlintrc.json](../.commitlintrc.json) です。

```
<type>: <subject>
```

利用できる `type` は `@commitlint/config-conventional` の既定値に従います。

`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `build` / `ci` / `chore` / `revert`

日本語の件名・本文を許容するため、以下のルールを無効化しています。

| ルール | 無効化する理由 |
| --- | --- |
| `subject-case` | 日本語の件名は大文字小文字の概念を持たないため |
| `body-max-line-length` | 日本語は1行あたりの文字数が少なく既定の100文字で頻繁に引っかかるため |
| `footer-max-line-length` | 同上 |

## 資格情報の検査

シークレット検査は [secretlint](https://github.com/secretlint/secretlint) の
`@secretlint/secretlint-rule-preset-recommend` を使用します。設定は
[.secretlintrc.json](../.secretlintrc.json) です。

AWS / GCP / GitHub / GitLab / Slack / Stripe / npm / Docker / Vercel / Cloudflare /
Notion / Figma / Anthropic / OpenAI / HuggingFace など29種のルールに加え、秘密鍵と
Basic 認証の資格情報を検出します。

`pre-commit` はステージ済みファイルのみが対象です。`pre-push` では
`git ls-files` で列挙した Git 追跡下の全ファイルを検査するため、`--no-verify` での
すり抜けや過去のコミットに紛れ込んだ資格情報も push 前に検出できます。

`dependencies` 関連では特に以下を検出します。

- `.npmrc` に書かれた npm アクセストークン (`_authToken=npm_...`) — `NPM_ACCESS_TOKEN`
- `package-lock.json` の `resolved` に埋め込まれた Basic 認証付きレジストリ URL
  (`https://user:pass@...`) — `BasicAuth`

検出時の出力は `--maskSecrets` でマスクされるため、ターミナルのスクロールバックや
CI のログに値そのものが残りません。

リポジトリ全体を手動で検査する場合は以下を実行してください。

```bash
npm run secretlint
```

## フックのスキップ

緊急時のみ以下でスキップできます。

```bash
LEFTHOOK=0 git commit ...
LEFTHOOK=0 git push ...
```

## 補足

パッケージのインストールはグローバル `~/.npmrc` が指すセキュリティプロキシ
(`https://npm.flatt.tech/`) 経由で行います。`--registry` での上書きはしないでください。
このプロキシが返すメタデータの tarball URL は `registry.npmjs.org` を指すため、
`package-lock.json` にプライベートな URL は書き込まれません。
