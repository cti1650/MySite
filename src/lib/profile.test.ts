import { describe, expect, it } from 'vitest';
import { buildIndexText } from './llmsContent';
import {
  birthdayIso,
  profile,
  qualifications,
  skillset,
  toDisplayList,
  toMetaKeywords,
} from './profile';

/**
 * プロフィールは ABOUT (top.tsx)・llms.txt・meta keywords の3箇所で使われる。
 * 以前はそれぞれが同じ内容を別々に持っていて食い違っていたため、
 * 「単一の出典から生成されていること」をテストで固定する。
 */

describe('profile', () => {
  it('Skillset に重複した項目を持たない', () => {
    expect(new Set(skillset).size).toBe(skillset.length);
  });

  it('TypeScript があるなら JavaScript は載せない（包含関係の重複を避ける）', () => {
    expect(skillset).toContain('TypeScript');
    expect(skillset).not.toContain('JavaScript');
  });

  it('区切り方が用途ごとに異なる', () => {
    // 表示・llms.txt は「カンマ+空白」、meta keywords は空白なし
    expect(toDisplayList(['A', 'B'])).toBe('A, B');
    expect(toMetaKeywords(['A', 'B'])).toBe('A,B');
  });

  it('birthdayIso は 0 埋めした ISO 形式を返す', () => {
    expect(birthdayIso()).toBe('1992-01-25');
  });
});

describe('llms.txt との整合', () => {
  const text = buildIndexText('https://example.com');

  it('Skillset が profile.ts と一致する', () => {
    expect(text).toContain(`- Skillset: ${toDisplayList(skillset)}`);
  });

  it('Qualifications が profile.ts と一致する', () => {
    expect(text).toContain(
      `- Qualifications & Tools: ${toDisplayList(qualifications)}`,
    );
  });

  it('氏名・ハンドル・誕生日が profile.ts と一致する', () => {
    expect(text).toContain(`- Name: ${profile.name}`);
    expect(text).toContain(`- Handle: ${profile.handle}`);
    expect(text).toContain(`- Birthday: ${birthdayIso()}`);
  });
});
