# 依存関係の更新

[Dependabot](https://docs.github.com/code-security/dependabot) で更新します。設定は
[.github/dependabot.yml](../.github/dependabot.yml) です。週次で、関連パッケージは
1つのPRにまとめます。

## cooldown

リリース直後の巻き戻しを避けるため、公開から一定日数が経った版のみを提案させます。

| 更新の種類 | 待機日数 |
| --- | --- |
| major | 30 |
| minor | 7 |
| patch | 3 |

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

`ignore` 対象は security update も提案されません。脆弱性は CI の
`npm audit --audit-level=high` で検知します。

### グループ

上から順に評価され、最初に一致したグループに割り当てられます。

| グループ | 対象 | 許容する更新 |
| --- | --- | --- |
| `react` | `react` / `react-dom` / `@types/react` / `@types/react-dom` | major / minor / patch |
| `zod` | `zod` / `mantine-form-zod-resolver` | major / minor / patch |
| `mantine` | `@mantine/*` / `postcss-preset-mantine` | major / minor / patch |
| `tailwind-postcss` | `tailwindcss` / `postcss` / `postcss-simple-vars` / `autoprefixer` | minor / patch |
| `lint-hooks` | `lefthook` / `secretlint` / `@secretlint/*` / `@commitlint/*` | patch |
| `types` | 上記以外の `@types/*` | minor / patch |

`zod` と `mantine-form-zod-resolver` を同じグループにしているのは、resolver 側が
zod のメジャーに追従して版が分かれるためです。

いずれのグループにも属さないもの (`next` / `axios` / `sharp` / `react-icons` /
`nodemailer` / `formidable` / `classcat`) は個別のPRになります。

## 自動マージ

[.github/workflows/dependabot-auto-merge.yml](../.github/workflows/dependabot-auto-merge.yml) で
Dependabot の PR に auto-merge を設定し、CI が通った時点で squash merge します。

自動マージの対象は `github-actions` の更新のみです
(`dependabot/fetch-metadata` の `package-ecosystem` 出力で判定)。npm の更新は
自動マージされず、通常のレビューを経ます。

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
