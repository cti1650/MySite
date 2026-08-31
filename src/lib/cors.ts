import type { NextApiRequest, NextApiResponse } from 'next';
import { CANONICAL_SITE_URL, resolveAllowedOrigin } from './siteUrl';

type CorsOptions = {
  /** OPTIONS以外に許可するメソッド */
  methods: string[];
};

/**
 * 許可ドメインのOriginのみを反射するCORS。
 * ワイルドカード（`*`）を返さないため、公開ドメインが増えても
 * ALLOWED_HOSTS に追加するだけで追従できる。
 *
 * @returns プリフライトに応答済みならtrue（呼び出し元は即returnすること）
 */
export const applyCors = (
  req: NextApiRequest,
  res: NextApiResponse,
  { methods }: CorsOptions,
): boolean => {
  const origin = resolveAllowedOrigin(req.headers.origin);

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Origin', origin ?? CANONICAL_SITE_URL);
  res.setHeader(
    'Access-Control-Allow-Methods',
    [...methods, 'OPTIONS'].join(','),
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '600');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
};

/** llms.txt など、意図的に誰でも読める公開エンドポイント向け */
export const applyPublicCors = (
  req: NextApiRequest,
  res: NextApiResponse,
): boolean => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
};
