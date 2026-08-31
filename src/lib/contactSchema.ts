import { z } from 'zod';

/**
 * お問い合わせフォームの検証スキーマ。
 * クライアント（Mantine Form）とAPIルートの双方から参照し、
 * サーバ側検証の抜けが発生しないようにする。
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'お名前は2文字以上入力してください。' })
    .max(100, { message: 'お名前は100文字以内で入力してください。' }),
  email: z
    .string()
    .trim()
    .max(254, { message: 'メールアドレスが長すぎます。' })
    .email({ message: '有効なメールアドレスを入力してください。' }),
  summary: z
    .string()
    .trim()
    .min(1, { message: 'お問い合わせの種類を選択してください。' })
    .max(100, { message: 'お問い合わせの種類が不正です。' }),
  body: z
    .string()
    .trim()
    .min(10, { message: '内容は10文字以上入力してください。' })
    .max(4000, { message: '内容は4000文字以内で入力してください。' }),
});

/** クライアント側のみ必要な同意チェックを足したスキーマ */
export const contactFormSchema = contactSchema.extend({
  termsOfService: z.boolean().refine((val) => val === true, {
    message: 'プライバシーポリシーに同意する必要があります。',
  }),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;

/**
 * メールヘッダに載せる値からCR/LFを除去する。
 * nodemailer側でもエンコードされるが、ヘッダ注入は多層で防ぐ。
 */
export const sanitizeHeaderValue = (value: string): string =>
  value
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, 200);
