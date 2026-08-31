import type { NextApiRequest } from 'next';

/**
 * セキュリティイベントの構造化ログ。
 * Vercel/Cloud Logging等はstdoutのJSONをそのまま構造化ログとして扱えるため、
 * 追加の依存は入れずJSON1行で出力する。
 *
 * 個人情報（氏名・メールアドレス・問い合わせ本文）は出力しない。
 * 異常検知は `event` と `outcome` の組み合わせを集計して行う想定。
 */

type Severity = 'info' | 'warn' | 'error';

type SecurityEvent = {
  event: string;
  outcome: 'success' | 'rejected' | 'failure';
  severity?: Severity;
  /** PIIを含めないこと。件数・理由・バイト数などの非識別情報のみ */
  detail?: Record<string, string | number | boolean | undefined>;
};

/** プロキシ経由でも実クライアントIPを取り出す（先頭が最も外側のクライアント） */
export const getClientIp = (req: NextApiRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const ip = raw?.split(',')[0]?.trim();
  return ip || req.socket.remoteAddress || 'unknown';
};

export const logSecurityEvent = (
  req: NextApiRequest,
  { event, outcome, severity, detail }: SecurityEvent,
): void => {
  const level: Severity = severity ?? (outcome === 'success' ? 'info' : 'warn');

  const record = {
    type: 'security',
    level,
    event,
    outcome,
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.url,
    host: req.headers.host,
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'],
    ...detail,
  };

  const line = JSON.stringify(record);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
};
