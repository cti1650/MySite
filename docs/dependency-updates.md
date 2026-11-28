# 依存関係の更新

[Dependabot](https://docs.github.com/code-security/dependabot) で更新します。設定は
[.github/dependabot.yml](../.github/dependabot.yml) です。週次で、関連パッケージは
1つのPRにまとめます。

## cooldown

リリース直後の巻き戻しを避けるため、公開から一定日数が経った版のみを提案させます。

| エコシステム | 更新の種類 | 待機日数 |
| --- | --- | --- |
| npm | major | 30 |
| npm | minor | 7 |
| npm | patch | 3 |
| github-actions | すべて | 7 |

`github-actions` は semver 前提のエコシステムとして扱われないため、`semver-major-days`
等では段階を分けられません (指定すると設定ファイル全体が解析エラーになります)。
`default-days` で一律指定しています。

自動マージの対象 (github-actions すべて、npm の patch と dev 依存の minor) は
レビューを経ないため、この待機期間が不正なリリースに対する主な防御になります。
security update には cooldown は適用されません。

## GitHub Actions

ワークフローの `uses` はすべて commit SHA で固定しています。タグは後から付け替えられるため、
タグ参照では同じワークフローが別のコードを実行しうるためです。末尾にバージョンを
コメントで残しています。

```yaml
uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
```

SHA の追従は手動では行いません。Dependabot が SHA と末尾のバージョンコメントの
両方を書き換えます。

## npm

`package.json` の `^` range は広いまま維持し、範囲を外れる時だけ書き換えます
(`versioning-strategy: increase-if-necessary`)。範囲内の更新は `package-lock.json`
のみの変更になります。

### 手動更新にするもの

CI で互換性を保証しにくいものは `ignore` に入れ、更新時期を自分で選びます。

| パッケージ | 理由 |
| --- | --- |
| `typescript` | 型エラーの出方が変わり、広範囲の修正を伴うことがある |
| `@biomejs/*` | lint / format ルールの既定値が変わり、差分が大きくなることがある |

`ignore` 対象は security update も提案されません。これらの脆弱性は
Dependabot alerts と CI の `audit` ジョブで検知します。

### グループ

上から順に評価され、最初に一致したグループに割り当てられます。

| グループ | 対象 | 許容する更新 |
| --- | --- | --- |
| `react` | `react` / `react-dom` / `@types/react` / `@types/react-dom` | major / minor / patch |
| `zod` | `zod` / `mantine-form-zod-resolver` | major / minor / patch |
| `mantine` | `@mantine/*` / `postcss-preset-mantine` | major / minor / patch |
| `tailwind-postcss` | `tailwindcss` / `postcss` / `postcss-simple-vars` / `autoprefixer` | minor / patch |
| `lint-hooks` | `lefthook` / `secretlint` / `@secretlint/*` / `@commitlint/*` | minor / patch |
| `test-tools` | `vitest` / `@vitest/*` / `@vitejs/*` / `happy-dom` / `@testing-library/*` | major / minor / patch |
| `nodemailer` | `nodemailer` / `@types/nodemailer` | major / minor / patch |
| `formidable` | `formidable` / `@types/formidable` | major / minor / patch |
| `types` | 上記以外の `@types/*` | minor / patch |

`zod` と `mantine-form-zod-resolver` を同じグループにしているのは、resolver 側が
zod のメジャーに追従して版が分かれるためです。`test-tools` は `vitest` と
`@vitejs/plugin-react` が同じ vite を前提にするためまとめています。`nodemailer` /
`formidable` は型定義を本体の major に揃えるため、`types` より前に置いて本体と組にしています。

`update-types` で外れた更新 (例: `lint-hooks` の major) はグループに入らず個別PRになります。

open PR の上限は 10 です (既定の 5 では、レビュー待ちの major が溜まると新しい提案が止まるため)。

いずれのグループにも属さないもの (`next` / `axios` / `sharp` / `react-icons` /
`nodemailer` / `formidable` / `classcat`) は個別のPRになります。

## 自動マージ

[.github/workflows/dependabot-auto-merge.yml](../.github/workflows/dependabot-auto-merge.yml) で
Dependabot の PR に auto-merge を設定し、CI が通った時点で squash merge します。

| エコシステム | 自動マージする | レビューを通す |
| --- | --- | --- |
| github-actions | すべて | — |
| npm | patch すべて / devDependencies の minor / テストツールの major | 上記以外の major / dependencies の minor |

判定は `dependabot/fetch-metadata` の `updated-dependencies-json` を依存ごとに見て、
**PR 内の全依存が条件を満たす場合のみ**対象にします。グループPRは本番依存の minor と
dev 依存の patch が混在することがあり、`update-type` などの集約出力では判定できないためです。

### major を自動マージするかの基準

「壊れたときに CI が必ず落ちるか」と「本番に影響しないか」の両方を満たすものだけを
自動マージにしています。

| 区分 | パッケージ | 理由 |
| --- | --- | --- |
| 自動マージ | `vitest` / `@vitest/*` / `@vitejs/*` / `happy-dom` / `@testing-library/*` | 壊れればテストが落ち、本番のバンドルにも入らない |
| レビュー | `lefthook` / `@commitlint/*` | CI では実行されず、ローカルのフックが壊れても気づけない |
| レビュー | `secretlint` / `@secretlint/*` | 検出ルールが減っても CI は通り、検査が静かに弱まりうる |
| レビュー | `@types/nodemailer` / `@types/formidable` | 本体の major と揃える必要がある |
| レビュー | dependencies すべて | 実行時の挙動が変わる |
| 手動 (`ignore`) | `typescript` / `@biomejs/*` | 前述 |

本番依存の minor をレビュー対象に残しているのは、Next や Mantine はテストが薄く、
CI を通っても画面の崩れを検知できないためです
([playbook](agents/review-dependency-update.md) の「テストがカバーしている範囲」参照)。

Dependabot の PR は fork 扱いとなり `pull_request` では読み取り専用トークンしか
得られないため、`pull_request_target` を使っています。PR のコードは checkout せず
マージ操作のみを行うため、未検証のコードは実行されません。

### 前提となるリポジトリ設定

| 設定 | 値 | 理由 |
| --- | --- | --- |
| Allow auto-merge | 有効 | 無効だと `gh pr merge --auto` が失敗する |
| `main` のブランチ保護 | `ci` を必須チェックに指定 | 必須チェックがないと CI 完了を待たず即マージされる |
| `enforce_admins` | 無効 | 管理者は `main` へ直接 push できる状態を維持するため |
| `strict` (最新化の強制) | 無効 | `main` に対して古いだけで PR がブロックされ、rebase が繰り返されるのを避けるため |
| Dependabot security updates | 有効 | 脆弱性の修正PRを cooldown を待たずに作らせるため |

`audit` は必須チェック (`ci`) に含めていません。audit の結果は PR の内容ではなく勧告の
公開時期で変わるため、必須にすると無関係な PR まで止まります。実際に、sharp の勧告が
出た際に github-actions の自動マージPRが6週間止まり、sharp を直す PR 自体も別の勧告
(next) で落ちてマージできませんでした。
