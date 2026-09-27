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
  /** ABOUT の冒頭に置く一言。meta description / OGP にも使う */
  headline: '業務の「面倒」を、仕組みごと無くす。',
  description:
    'AI・Web・クラウドから GAS・VBA まで、環境の制約に合わせて手段を選び、業務自動化と社内ツール開発をしています。',
} as const;

/**
 * 並び順は AI → Web → バックエンド/インフラ/データ → モバイル → 業務効率化。
 * 先頭から読まれるため順序自体が意味を持つ。
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
