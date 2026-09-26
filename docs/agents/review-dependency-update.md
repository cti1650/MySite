# playbook: 依存更新PRを評価する

Dependabot の設定と方針は [../dependency-updates.md](../dependency-updates.md) にあります。
ここには**評価の手順**を書きます。

## 前提として知っておくこと

- 自動マージされるのは `github-actions` の更新のみです。npm の更新は必ず人の判断を通ります
- `cooldown` が効いているため、提案されている版は公開から一定日数が経っています
  （npm: major 30日 / minor 7日 / patch 3日）
- **グループの `update-types` は更新を止めません。** 対象外の更新はグループから外れて
  個別PRになるだけです。実例として `tailwind-postcss` は minor/patch 限定ですが
  Tailwind の major は個別PRとして提案されました。major を本当に抑止したい場合は
  `ignore` に `update-types` を指定する必要があります
- `typescript` と `@biomejs/*` は `ignore` にあるため提案されません（手動更新）。
  これらは security update も提案されないので、脆弱性は CI の
  `npm audit --audit-level=high` で検知します

## 手順

### 1. 何が変わるかを確認する

```bash
gh pr view <PR番号>
gh pr diff <PR番号> -- package.json
```

major かどうか、グループなら何が同時に上がるかを見ます。

### 2. ローカルで実際に当てる

CI を待つより手元で試したほうが早く、原因も特定しやすいです。

```bash
gh pr checkout <PR番号>
npm ci
npm test
npm run typecheck
npm run build
```

この4つが揃って通ることを確認します。**`npm test` だけでは不十分です** — 型定義の
変更（React の `@types` など）はテストを通過しても `typecheck` で落ち、
ビルド設定の変更（Tailwind など）は両方を通過しても `build` で落ちます。

元に戻すには次のようにします。

```bash
git checkout main
npm ci
```

### 3. テストがカバーしている範囲を把握する

このリポジトリのテストは移行検知を目的に選ばれています。更新対象に応じて、
どのテストが効くかを確認してください。

| 更新対象 | 効くテスト |
| --- | --- |
| React / @types/react | `ViewLayerProvider.test.tsx`（context・effect・StrictMode）、`ContentFilter.test.tsx`、hooks のテスト |
| zod | `contactSchema.test.ts`（境界値とエラー文言を固定済み） |
| Tailwind | `TitleBox.test.tsx`（付与されるクラスを固定済み） |
| Next | 直接のテストは無い。`npm run build` と Vercel のプレビューで見る |
| Mantine | `mantineForm.test.tsx`（resolver との組み合わせ）。他の Mantine 依存コンポーネントは未整備 |

**テストが通っても安心できない対象**があります。Next とほとんどの Mantine 依存
コンポーネントはテストが薄いので、Vercel のプレビューデプロイで実際の画面を
確認してください。

### 4. 破壊的変更を調べる

major の場合は changelog / migration guide を読みます。とくに次を確認します。

- 非推奨になったAPIをこのリポジトリが使っているか
- 設定ファイルの形式が変わるか（Tailwind 4 は CSS ベースに変わります）
- peer dependency の要求が上がるか（他の依存と衝突しないか）

`grep` で実際の使用箇所を確認し、「使っていないから無関係」と言えるものは
そう判断してよいです。

### 5. 判断

| 状況 | 判断 |
| --- | --- |
| 4つのコマンドが通り、破壊的変更が該当しない | マージしてよい |
| テストは通るが設定形式の移行が必要 | コード変更を同じPRに追加してからマージ |
| 他の major と同時でないと通らない | どちらを先に当てるか決め、PRにその旨を書く |
| 上流にリグレッションの報告がある | `cooldown` を延ばすか、次の patch を待つ |

## 複数の major が待機している場合

影響範囲が独立しているものから当てます。同時に複数を当てると、失敗したときに
どちらが原因か分からなくなります。

この順序は絶対ではありません。上流の状況を見て判断してください。

### 実例（2026-09、React 19 / Next 16 / zod 4 / Mantine 9 / Tailwind 4 を適用した際）

- **peer dependency の順序に依存関係がある。** Mantine 9 は peer で
  `react ^19.2.0` を要求するため、React を先に上げないと `npm ci` が
  ERESOLVE で失敗した
- **4つのコマンドが揃って通っても壊れることがある。** zod 4 で
  `ZodError.errors` が削除され、`mantine-form-zod-resolver` の `zodResolver`
  (v3向け) は型は通るが実行時に例外を投げた。フォームにテストが無かったため
  検知できず、テストを追加して初めて判明した（動作確認のログは
  [PR #16](https://github.com/cti1650/MySite/pull/16) を参照）
- **ブランチを作り直すときは、その時点の最新のマージ先を基点にする。**
  検証済みの状態から別の major を先にマージすると、その後に作る PR が
  古い基点のままだと新しい組み合わせが一度も CI に乗らない
  （Mantine 9 の PR を React 19 マージ前の基点で作り直した結果、
  Mantine 9 が変更した Textarea の autosize 実装と、後から入った zod 4 対応の
  フォームテストの組み合わせが未検証のまま両方マージされ、happy-dom の
  `document.fonts` 未実装が原因で `main` の test が一時的に落ちた。
  [PR #23](https://github.com/cti1650/MySite/pull/23) で復旧）

## PRにコメントを残す

判断の根拠（実行したコマンドと結果、確認した破壊的変更）をPRに書いてください。
後から「なぜこの順で当てたか」を追えるようにするためです。
