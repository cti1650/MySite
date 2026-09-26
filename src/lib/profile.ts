/**
 * プロフィール情報の単一の出典。
 *
 * 同じ内容を ABOUT (top.tsx)・llms.txt (llmsContent.ts)・meta keywords (_app.tsx)
 * が別々に持っていた結果、TypeScript の記載漏れや Tailwind CSS の表記揺れなど
 * 食い違いが発生していたため、ここに集約する。
 */

export const profile = {
  name: 'Yuichi Sakagami',
  handle: 'cti1650',
  birthday: { year: 1992, month: 1, date: 25 },
} as const;

/**
 * 市場評価の高い順に並べる(AI → Web → バックエンド/インフラ/データ → モバイル)。
 * 先頭ほど強みとして読まれるため並び順は意味を持つ。
 * 末尾の業務効率化は単価では上位に来ないが、環境の制約を問わず改善を通せる
 * 差別化要素なので独立したまとまりとして残す。
 * HTML/CSS/JavaScript は React・Next.js・TypeScript から自明なため載せない。
 */
export const skillset = [
  'LLMを用いた機能開発',
  'TypeScript',
  'React',
  'Next.js',
  'Tailwind CSS',
  'Hono',
  'Python',
  'PHP',
  'Docker',
  'Google Cloud Functions',
  'BigQuery',
  'dbt',
  'React Native',
  'Expo',
  'WXT',
  'Chrome拡張機能開発',
  'GAS',
  'VBA',
] as const;

export const qualifications = [
  'ITパスポート',
  'VBA Expert Standard(Excel)',
  'GitHub',
  'VSCode',
] as const;

/** 表示・llms.txt 共通の「カンマ+空白」区切り */
export const toDisplayList = (items: readonly string[]): string =>
  items.join(', ');

/** meta keywords は空白を入れない慣習に合わせる */
export const toMetaKeywords = (items: readonly string[]): string =>
  items.join(',');

/** llms.txt 用の ISO 形式 (YYYY-MM-DD) */
export const birthdayIso = (): string => {
  const { year, month, date } = profile.birthday;
  return `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
};
