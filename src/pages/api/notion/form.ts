import axios from 'axios';
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
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
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<ResponseData>>
) {
  await runMiddleware(req, res, cors);
  const endpoint = process.env.NEXT_PUBLIC_NOTION_BACKEND_ENDPOINT;
  const apiKey = process.env.NEXT_PUBLIC_NOTION_KEY;
  const databaseId = process.env.NEXT_PUBLIC_NOTION_CONTACT_DATABASE_ID;
  if (req.method === 'POST') {
    // console.log('req', req);
    const form = formidable({});
    form.parse(req, async function (err, fields) {
      console.log('fields', fields);
      if (err) {
        res.status(500).json({
          error: err,
        });
        res.end();
        return;
      }
      const { name, email, body, summary } = fields;
      if (!name[0] || !email[0] || !body[0] || !summary[0]) {
        res.status(400).json({
          error: 'validate error',
        });
        return;
      }
      const request = await axios.post(
        `${endpoint}databases/${databaseId}/form`,
        {
          name: name[0] ?? '',
          email: email[0] ?? '',
          summary: summary[0] ?? '',
          body: body[0] ?? '',
          tags: ['MySite'],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            notionApiKey: apiKey,
          },
        }
      );
      const json = await request.data;

      // Gmail通知
      const notionUrl = json?.url ?? '';
      await sendGmail({
        subject: `[MySite] お問い合わせ: ${summary[0]}`,
        replyTo: email[0],
        text: [
          `名前: ${name[0]}`,
          `メール: ${email[0]}`,
          `件名: ${summary[0]}`,
          '',
          body[0],
          '',
          ...(notionUrl ? [`Notion: ${notionUrl}`] : []),
        ].join('\n'),
      });

      res.status(200).json(json);
    });
  }
}
