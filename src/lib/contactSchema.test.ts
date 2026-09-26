import { describe, expect, it } from 'vitest';
import {
  contactFormSchema,
  contactSchema,
  sanitizeHeaderValue,
} from './contactSchema';

/**
 * このテストは zod のメジャー移行(3→4)で挙動が変わらないことを守る目的も持つ。
 * エラーメッセージは画面に出る文言そのものなので、内容まで固定している。
 */

const valid = {
  name: '山田太郎',
  email: 'taro@example.com',
  summary: 'お仕事のご相談',
  body: '10文字以上の問い合わせ本文です。',
};

/** 最初のエラーメッセージをフィールド単位で取り出す */
const errorFor = (
  result: ReturnType<typeof contactSchema.safeParse>,
  field: string,
): string | undefined =>
  result.success
    ? undefined
    : result.error.issues.find((issue) => issue.path[0] === field)?.message;

describe('contactSchema', () => {
  it('妥当な入力を通す', () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('前後の空白を除去した値を返す', () => {
    const result = contactSchema.safeParse({
      ...valid,
      name: '  山田太郎  ',
      email: '  taro@example.com  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('山田太郎');
      expect(result.data.email).toBe('taro@example.com');
    }
  });

  describe('name', () => {
    it('1文字は拒否する', () => {
      const result = contactSchema.safeParse({ ...valid, name: 'あ' });
      expect(errorFor(result, 'name')).toBe(
        'お名前は2文字以上入力してください。',
      );
    });

    it('空白のみは trim 後に文字数不足として拒否する', () => {
      const result = contactSchema.safeParse({ ...valid, name: '     ' });
      expect(errorFor(result, 'name')).toBe(
        'お名前は2文字以上入力してください。',
      );
    });

    it('100文字を超えると拒否する', () => {
      const result = contactSchema.safeParse({
        ...valid,
        name: 'あ'.repeat(101),
      });
      expect(errorFor(result, 'name')).toBe(
        'お名前は100文字以内で入力してください。',
      );
    });

    it('境界値(2文字・100文字)は通す', () => {
      expect(contactSchema.safeParse({ ...valid, name: 'あい' }).success).toBe(
        true,
      );
      expect(
        contactSchema.safeParse({ ...valid, name: 'あ'.repeat(100) }).success,
      ).toBe(true);
    });
  });

  describe('email', () => {
    it('形式が不正なものを拒否する', () => {
      for (const email of [
        'taro',
        'taro@',
        '@example.com',
        'taro example.com',
      ]) {
        const result = contactSchema.safeParse({ ...valid, email });
        expect(errorFor(result, 'email')).toBe(
          '有効なメールアドレスを入力してください。',
        );
      }
    });

    it('254文字を超えると拒否する', () => {
      const longEmail = `${'a'.repeat(250)}@example.com`;
      const result = contactSchema.safeParse({ ...valid, email: longEmail });
      expect(errorFor(result, 'email')).toBe('メールアドレスが長すぎます。');
    });
  });

  describe('summary', () => {
    it('空を拒否する', () => {
      const result = contactSchema.safeParse({ ...valid, summary: '' });
      expect(errorFor(result, 'summary')).toBe(
        'お問い合わせの種類を選択してください。',
      );
    });

    it('100文字を超えると拒否する', () => {
      const result = contactSchema.safeParse({
        ...valid,
        summary: 'あ'.repeat(101),
      });
      expect(errorFor(result, 'summary')).toBe(
        'お問い合わせの種類が不正です。',
      );
    });
  });

  describe('body', () => {
    it('10文字未満を拒否する', () => {
      const result = contactSchema.safeParse({ ...valid, body: '短い' });
      expect(errorFor(result, 'body')).toBe(
        '内容は10文字以上入力してください。',
      );
    });

    it('4000文字を超えると拒否する', () => {
      const result = contactSchema.safeParse({
        ...valid,
        body: 'あ'.repeat(4001),
      });
      expect(errorFor(result, 'body')).toBe(
        '内容は4000文字以内で入力してください。',
      );
    });
  });

  it('未知のキーは結果に含めない', () => {
    const result = contactSchema.safeParse({ ...valid, admin: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty('admin');
    }
  });
});

describe('contactFormSchema', () => {
  it('同意チェックがtrueなら通す', () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      termsOfService: true,
    });
    expect(result.success).toBe(true);
  });

  it('同意チェックがfalseなら拒否する', () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      termsOfService: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.find((issue) => issue.path[0] === 'termsOfService')
          ?.message,
      ).toBe('プライバシーポリシーに同意する必要があります。');
    }
  });

  it('同意チェックが欠けていれば拒否する', () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(false);
  });

  it('サーバ側スキーマは同意チェックを要求しない', () => {
    // クライアント専用の項目がAPI側の検証を落とさないこと
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
});

describe('sanitizeHeaderValue', () => {
  it('CR/LFを空白に潰してヘッダ注入を防ぐ', () => {
    expect(sanitizeHeaderValue('件名\r\nBcc: evil@example.com')).toBe(
      '件名 Bcc: evil@example.com',
    );
    expect(sanitizeHeaderValue('a\nb')).toBe('a b');
    expect(sanitizeHeaderValue('a\rb')).toBe('a b');
  });

  it('連続する改行をまとめて1つの空白にする', () => {
    expect(sanitizeHeaderValue('a\r\n\r\n\nb')).toBe('a b');
  });

  it('前後の空白を除去する', () => {
    expect(sanitizeHeaderValue('  件名  ')).toBe('件名');
    expect(sanitizeHeaderValue('\r\n件名\r\n')).toBe('件名');
  });

  it('200文字で切り詰める', () => {
    expect(sanitizeHeaderValue('a'.repeat(300))).toHaveLength(200);
  });

  it('空文字はそのまま空文字', () => {
    expect(sanitizeHeaderValue('')).toBe('');
  });
});
