# テスト

[Vitest](https://vitest.dev/) + [happy-dom](https://github.com/capricorn86/happy-dom) で実行します。
設定は [vitest.config.mts](../vitest.config.mts)、共通の前処理は
[vitest.setup.ts](../vitest.setup.ts) です。

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm test` | 全テストを1回実行（CI・pre-push と同じ） |
| `npm run test:watch` | 変更を監視して再実行 |
| `npm run test:coverage` | カバレッジ付きで実行 |

## 方針

ライブラリのメジャー移行（React・zod・Tailwind 等）で壊れたことを
検知できるかを基準に対象を選んでいます。網羅率は目的にしていません。

テストは対象ファイルと同じ場所に `*.test.ts` / `*.test.tsx` で置きます。

### 汎用ロジック

| 対象 | 守っている契約 |
| --- | --- |
| [siteUrl.ts](../src/lib/siteUrl.ts) | ホスト許可リスト・ワイルドカード・許可外ホストのフォールバック |
| [cache.ts](../src/lib/cache.ts) | stale-while-revalidate / stale-if-error / single-flight |
| [contactSchema.ts](../src/lib/contactSchema.ts) | 検証の境界値とエラー文言、ヘッダ注入対策 |
| [logger.ts](../src/lib/logger.ts) | `x-forwarded-for` の解析、severity の決定、PIIを出力しないこと |
| [llmsContent.ts](../src/lib/llmsContent.ts) | 外部データの改行を潰して行構造を守ること |
| [pageProps.ts](../src/lib/pageProps.ts) | 未知レイヤーの404化、キャッシュヘッダ、メタURLの組み立て |
| [context/config.ts](../src/components/context/config.ts) | レイヤーの親子関係（重複・循環・参照先の整合性） |

### UI（happy-dom）

| 対象 | 守っている契約 |
| --- | --- |
| [ContentFilter.tsx](../src/components/context/ContentFilter.tsx) | 祖先レイヤーの継承による表示/非表示の判定 |
| [ViewLayerProvider.tsx](../src/components/context/ViewLayerProvider.tsx) | context の伝播、`useViewLayerPage` の effect、StrictMode での二重実行 |
| [TitleBox.tsx](../src/components/title/TitleBox.tsx) | props の既定値と size / color バリアントで付与されるクラス |
| [mantineForm.tsx](../src/components/form/mantineForm.tsx) | zod スキーマと resolver の組み合わせが検証失敗時に例外を投げないこと |
| [useAge.ts](../src/hooks/useAge.ts) | 誕生日前後・うるう年の年齢計算 |
| [usePageView.ts](../src/hooks/usePageView.ts) | ルーターイベントの購読と**アンマウント時の解除** |

## 書くときの注意

### 環境変数をモジュール読み込み時に評価するモジュール

`siteUrl.ts` と `gtag.ts` は `process.env` をモジュールのトップレベルで
評価します。環境変数を変えて検証する場合は、`vi.resetModules()` の後に
動的 import し直す必要があります。

```ts
vi.resetModules();
vi.stubEnv('ALLOWED_HOSTS', '*.example.net');
const { isAllowedHost } = await import('./siteUrl');
```

ファイル間で `process.env` が混ざらないよう、`vitest.config.mts` で
`isolate: true` を指定しています。

### 1つのテスト内で複数回描画する場合

`cleanup()` はテスト単位で走るため、同じテスト内で2回描画すると
DOM に両方が残ります。`within(container)` で描画ごとにスコープを
限定してください（[ContentFilter.test.tsx](../src/components/context/ContentFilter.test.tsx) が例）。

### 現在日付に依存するロジック

`vi.setSystemTime()` で時刻を固定します。固定しないと、誕生日の前後など
特定の日にだけ落ちるテストになります。

## パスエイリアス

`vitest.config.mts` の `resolve.alias` が `tsconfig.json` の
`compilerOptions.paths` と同じ内容を持ちます。自動追従させる
`vite-tsconfig-paths` は unmaintained な `tsconfck` を引き込むため使っていません。
**tsconfig.json 側のパスを変えたら vitest.config.mts も変えてください。**
