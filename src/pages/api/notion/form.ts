import axios from 'axios';
import Cors from 'cors';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendGmail } from 'src/lib/gmailApi';

type ResponseData = {
  message: string;
  error: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

// CORS のミドルウェアを初期化
const cors = Cors({
  methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
});

// 後続の処理を行う前にミドルウェアの実行を待ち、
// また、ミドルウェアでエラーが発生したときエラーを投げるためのヘルパーメソッド
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    req: NextApiRequest,
    res: NextApiResponse,
    cb: (result: unknown) => void,
  ) => void,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<ResponseData>>,
) {
  await runMiddleware(req, res, cors);
  const endpoint = process.env.NOTION_BACKEND_ENDPOINT;
  const apiKey = process.env.NOTION_KEY;
  const databaseId = process.env.NOTION_CONTACT_DATABASE_ID;
  if (req.method === 'POST') {
    // console.log('req', req);
    const form = formidable({});
    form.parse(req, async (err: Error | null, fields: formidable.Fields) => {
      if (err) {
        res.status(500).json({ error: 'Form parsing failed' });
        res.end();
        return;
      }
      const nameVal = fields.name?.[0];
      const emailVal = fields.email?.[0];
      const bodyVal = fields.body?.[0];
      const summaryVal = fields.summary?.[0];
      if (!nameVal || !emailVal || !bodyVal || !summaryVal) {
        res.status(400).json({ error: 'Validation error' });
        return;
      }
      try {
        const request = await axios.post(
          `${endpoint}databases/${databaseId}/form`,
          {
            name: nameVal,
            email: emailVal,
            summary: summaryVal,
            body: bodyVal,
            tags: ['MySite'],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              notionApiKey: apiKey,
            },
          },
        );
        const json = await request.data;

        // Gmail通知（失敗してもレスポンスには影響させない）
        try {
          const notionUrl = json?.url ?? '';
          await sendGmail({
            subject: `[MySite] お問い合わせ: ${summaryVal}`,
            replyTo: emailVal,
            text: [
              `名前: ${nameVal}`,
              `メール: ${emailVal}`,
              `件名: ${summaryVal}`,
              '',
              bodyVal,
              '',
              ...(notionUrl ? [`Notion: ${notionUrl}`] : []),
            ].join('\n'),
          });
        } catch (mailErr) {
          console.error('Gmail notification failed:', mailErr);
        }

        res.status(200).json(json);
      } catch (apiErr) {
        console.error('Notion API request failed:', apiErr);
        res.status(500).json({ error: 'Failed to submit form' });
      }
    });
  }
}
