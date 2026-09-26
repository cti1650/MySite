# playbook: API ルートを追加する

`src/pages/api/` 配下に置きます。Pages Router の API Routes です。

既存の実装を必ず1つ読んでから書いてください。参考になるのは次の3つです。

| 種類 | 実装 |
| --- | --- |
| 公開（誰でも読める）GET | [src/pages/api/llms/index.txt.ts](../../src/pages/api/llms/index.txt.ts) |
| 許可ドメイン限定 GET | [src/pages/api/content/index.ts](../../src/pages/api/content/index.ts) |
| POST（入力検証あり） | [src/pages/api/notion/form.ts](../../src/pages/api/notion/form.ts) |

## 骨格

```ts
import { applyCors } from '@lib/cors';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  // 1. CORS。プリフライトに応答済みならtrueが返るので即return
  if (applyCors(req, res, { methods: ['GET'] })) return;

  // 2. メソッド確認。Allowヘッダを付けて405
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).end();
  }

  // 3. 本処理
}
```

この順序を変えないでください。CORS を先に通さないとプリフライトが 405 になります。

## CORS の選択

| 用途 | 使うもの | Access-Control-Allow-Origin |
| --- | --- | --- |
| サイト自身から呼ぶAPI | `applyCors(req, res, { methods })` | 許可ドメインのOriginのみ反射 |
| 意図的に誰でも読める公開エンドポイント | `applyPublicCors(req, res)` | `*` |

**`applyPublicCors` は llms.txt / robots.txt のような「公開が目的」のものだけです。**
判断に迷う場合は `applyCors` を選んでください。ワイルドカードを自前で
`setHeader` することはしません。

## URL を組み立てる場合

`req.headers.host` を直接使わず、`resolveBaseUrl(req.headers)` を通します。
Host ヘッダは詐称できるため、許可リストに無いホストはカノニカルURLに
フォールバックします。

```ts
import { resolveBaseUrl } from '@lib/siteUrl';
const baseUrl = resolveBaseUrl(req.headers);
```

## 入力検証

zod スキーマを `src/lib/` に置き、**クライアントとAPIの両方から同じスキーマを参照**します
（[src/lib/contactSchema.ts](../../src/lib/contactSchema.ts) が例）。API 側だけ検証が
緩い状態を作らないでください。

`safeParse` を使い、失敗時は 400 を返します。**エラーの詳細（どの値が不正だったか）を
レスポンスに載せないでください。**

## ログ

セキュリティ上意味のあるイベントは `logSecurityEvent` で記録します。

```ts
import { logSecurityEvent } from '@lib/logger';

logSecurityEvent(req, {
  event: 'contact.validation_failed',
  outcome: 'rejected',
  detail: { fields: ['email'] }, // 件数・項目名など非識別情報のみ
});
```

`outcome` は `success` / `rejected` / `failure` のいずれか。**`detail` に氏名・
メールアドレス・問い合わせ本文を入れないでください。** 異常検知は `event` と
`outcome` の組み合わせを集計して行う前提です。

## 外部APIを呼ぶ場合

直接 `axios` を叩かず、`createCachedFetcher` で包んだ取得関数を `src/lib/` に作ります。
SSR なので上流の障害がページ表示に直結するため、stale-if-error が必要です。

```ts
import { createCachedFetcher } from '@lib/cache';

export const getThing = createCachedFetcher(fetchThing, {
  ttlMs: 3600 * 1000,
  isSuccess: (result) => !result.error, // 空配列やerrorで失敗を表す上流に合わせる
});
```

## キャッシュヘッダ

CDN に載せる場合は `buildCacheControl(秒)` を使います。自前で `Cache-Control` の
文字列を組み立てないでください。

```ts
import { buildCacheControl } from '@lib/cache';
res.setHeader('Cache-Control', buildCacheControl(3600));
```

## テキストを返す場合

`Content-Type` と `Content-Length` を明示します（llms.txt 系がそうしています）。

```ts
res.setHeader('Content-Type', 'text/plain; charset=utf-8');
res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
```

外部データ由来の文字列を行構造のあるテキストに入れる場合は、`flatten` 相当の
改行除去を通してください。

## エラー応答

上流のエラーメッセージをそのまま返さず、固定の日本語メッセージにします
（`fetchContentPageProps` が同じ方針です）。スタックトレースや接続先ホストが
漏れないようにするためです。

## 仕上げ

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

ルートを追加したら `npm run build` の出力に `ƒ /api/...` として現れることを確認します。
