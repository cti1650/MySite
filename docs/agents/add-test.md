# playbook: テストを追加する

Vitest + happy-dom です。方針と既存の対象一覧は [../testing.md](../testing.md) を
先に読んでください。ここには**実際に踏んだ落とし穴**を書きます。

## 置き場所と実行

- テストは対象ファイルと同じ場所に `*.test.ts` / `*.test.tsx`
- `npm test` で全件、`npx vitest run <path>` で個別
- `vitest.config.mts` の `include` は `src/**/*.test.{ts,tsx}` です

## 何をテストするか

網羅率は目的にしません。**ライブラリのメジャー移行で壊れたことを検知できるか**を
基準にします。優先するのは次の2つです。

1. 汎用ロジック（`src/lib/`）— とくにセキュリティ上の契約を持つもの
2. context / effect / props 既定値に依存する箇所 — React の挙動変化を受ける

逆に、テストのためにプロダクションコードの設計を変えることはしません。

## 落とし穴

### 1. 環境変数をモジュール読み込み時に評価するモジュール

`src/lib/siteUrl.ts` と `src/lib/gtag.ts` は `process.env` をトップレベルで評価します。
`vi.stubEnv` だけでは**既に読み込まれた値は変わりません**。`vi.resetModules()` の後に
動的 import してください。

```ts
const loadWithEnv = async (env: Record<string, string>) => {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  return import('./siteUrl');
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});
```

ファイル間で `process.env` が混ざらないよう `vitest.config.mts` で `isolate: true` を
指定しています。実例は [src/lib/siteUrl.test.ts](../../src/lib/siteUrl.test.ts)。

### 2. 1つのテスト内で複数回描画する場合

`cleanup()` はテスト単位で走るため、同じ `it` の中で2回 `render` すると DOM に
両方が残り、`screen.getByText` が «複数見つかった» で落ちます。描画ごとに
`within(container)` でスコープを限定してください。

```tsx
const isShownAt = (layer: string, children: ReactNode): boolean => {
  const { container } = render(
    <ViewLayerContext.Provider value={[layer, () => {}]}>
      {children}
    </ViewLayerContext.Provider>,
  );
  return within(container).queryByText('表示対象') !== null;
};
```

実例は [src/components/context/ContentFilter.test.tsx](../../src/components/context/ContentFilter.test.tsx)。

### 3. 現在日付・現在時刻に依存するロジック

`vi.setSystemTime()` で固定します。固定しないと誕生日の前後など特定の日にだけ落ちる
テストになります。タイマーを使ったら `afterEach` で `vi.useRealTimers()` を呼びます。
実例は [src/hooks/useAge.test.ts](../../src/hooks/useAge.test.ts)。

### 4. デフォルト引数は `undefined` を渡すと効いてしまう

「値が無い状態」を表したいときに `undefined` を渡すと、ヘルパー側のデフォルト値が
適用されて意図と逆のテストになります。`null` を受け取って `?? undefined` に変換する等、
「無い」を明示的に表現してください。

### 5. 外部APIに依存するモジュール

`src/lib/contentApi.ts` と `src/lib/portfolioApi.ts` は `createCachedFetcher` で
包まれたシングルトンです。これらを使う側（`llmsContent` / `pageProps`）のテストでは
モジュールごとモックします。

```ts
const getContent = vi.fn();
vi.mock('./contentApi', () => ({ getContent }));
```

### 6. 非同期のキャッシュ挙動

`createCachedFetcher` は「古い値を即返して裏で更新」します。更新後の値を確認するには
`vi.waitFor` を使います。フェイクタイマーと併用する場合、`vi.advanceTimersByTime` で
TTL を超えさせてから検証します。実例は [src/lib/cache.test.ts](../../src/lib/cache.test.ts)。

### 7. happy-dom に無い DOM API を無防備に呼ぶ依存

Mantine 9 の Textarea は autosize を自前実装に差し替えており、描画時に
`document.fonts.addEventListener('loadingdone', ...)` を呼びます。happy-dom は
FontFaceSet API (`document.fonts`) を実装していないため、autosize 付き
Textarea を含む画面を描画すると
`Cannot read properties of undefined (reading 'addEventListener')` で落ちます。

環境側の不足なので、[vitest.setup.ts](../../vitest.setup.ts) でスタブしています。
新しく落ちる DOM API が出た場合も、プロダクションコードではなくここに足してください。

## Mantine を使うコンポーネント

`src/components/form/`、`src/components/page/content.tsx`、
`src/components/tool/DifyChatbot.tsx` は Mantine に依存します。描画には
`MantineProvider` でのラップが必要です。`src/components/form/` は
[mantineForm.test.tsx](../../src/components/form/mantineForm.test.tsx) で
整備済みです。他はまだ未整備なので、追加する場合はラッパーを用意してください。

## パスエイリアスを増やした場合

`vitest.config.mts` の `resolve.alias` は `tsconfig.json` の `compilerOptions.paths` を
**手書きで複製**しています（`vite-tsconfig-paths` は unmaintained な `tsconfck` を
引き込むため採用していません）。**tsconfig 側にエイリアスを追加したら
`vitest.config.mts` にも追加してください。** 忘れるとテストだけが解決に失敗します。

## 仕上げ

```bash
npm test
npm run lint
npm run typecheck
```

`npm run lint` はインポート順も直すため、`npm run fix` で自動修正できます。
