import { contactSchema, sanitizeHeaderValue } from '@lib/contactSchema';
import { applyCors } from '@lib/cors';
import { sendGmail } from '@lib/gmailApi';
import { logSecurityEvent } from '@lib/logger';
import axios from 'axios';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  error: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * multipart/form-data の受け入れ上限。
 * このフォームはテキスト4項目のみでファイル添付は使わないため、
 * ファイルを拒否して一時ディレクトリの枯渇を防ぐ。
 */
const formOptions: formidable.Options = {
  maxFields: 10,
  maxFieldsSize: 64 * 1024, // 64KB
  maxFiles: 0,
  allowEmptyFiles: false,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<ResponseData>>,
) {
  if (applyCors(req, res, { methods: ['POST'] })) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    logSecurityEvent(req, {
      event: 'contact.method_not_allowed',
      outcome: 'rejected',
    });
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let fields: formidable.Fields;
  try {
    [fields] = await formidable(formOptions).parse(req);
  } catch (parseErr) {
    logSecurityEvent(req, {
      event: 'contact.parse_failed',
      outcome: 'rejected',
      detail: {
        reason: parseErr instanceof Error ? parseErr.message : 'unknown',
      },
    });
    return res.status(400).json({ error: 'Form parsing failed' });
  }

  const parsed = contactSchema.safeParse({
    name: fields.name?.[0],
    email: fields.email?.[0],
    summary: fields.summary?.[0],
    body: fields.body?.[0],
  });

  if (!parsed.success) {
    logSecurityEvent(req, {
      event: 'contact.validation_failed',
      outcome: 'rejected',
      // 入力値そのものはPIIのため出さず、どの項目が落ちたかだけ記録する
      detail: {
        fields: parsed.error.issues
          .map((issue) => issue.path.join('.'))
          .join(','),
      },
    });
    return res.status(400).json({ error: 'Validation error' });
  }

  const { name, email, summary, body } = parsed.data;
  const endpoint = process.env.NOTION_BACKEND_ENDPOINT;
  const apiKey = process.env.NOTION_KEY;
  const databaseId = process.env.NOTION_CONTACT_DATABASE_ID;

  if (!endpoint || !apiKey || !databaseId) {
    logSecurityEvent(req, {
      event: 'contact.misconfigured',
      outcome: 'failure',
      severity: 'error',
    });
    return res.status(500).json({ error: 'Failed to submit form' });
  }

  try {
    const request = await axios.post(
      `${endpoint}databases/${databaseId}/form`,
      { name, email, summary, body, tags: ['MySite'] },
      {
        headers: {
          'Content-Type': 'application/json',
          notionApiKey: apiKey,
        },
      },
    );
    const json = request.data;

    // Gmail通知（失敗してもレスポンスには影響させない）
    try {
      const notionUrl = json?.url ?? '';
      await sendGmail({
        subject: `[MySite] お問い合わせ: ${sanitizeHeaderValue(summary)}`,
        replyTo: sanitizeHeaderValue(email),
        text: [
          `名前: ${name}`,
          `メール: ${email}`,
          `件名: ${summary}`,
          '',
          body,
          '',
          ...(notionUrl ? [`Notion: ${notionUrl}`] : []),
        ].join('\n'),
      });
    } catch (mailErr) {
      logSecurityEvent(req, {
        event: 'contact.mail_failed',
        outcome: 'failure',
        severity: 'error',
        detail: {
          reason: mailErr instanceof Error ? mailErr.message : 'unknown',
        },
      });
    }

    logSecurityEvent(req, {
      event: 'contact.submitted',
      outcome: 'success',
      detail: { bodyLength: body.length },
    });
    res.status(200).json(json);
  } catch (apiErr) {
    logSecurityEvent(req, {
      event: 'contact.notion_failed',
      outcome: 'failure',
      severity: 'error',
      detail: {
        reason: apiErr instanceof Error ? apiErr.message : 'unknown',
      },
    });
    res.status(500).json({ error: 'Failed to submit form' });
  }
}
