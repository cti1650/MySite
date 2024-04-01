import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<ResponseData>>
) {
  const endpoint = process.env.NEXT_PUBLIC_NOTION_BACKEND_ENDPOINT;
  const apiKey = process.env.NEXT_PUBLIC_NOTION_KEY;
  const databaseId = process.env.NEXT_PUBLIC_NOTION_CONTACT_DATABASE_ID;
  if (req.method === 'POST') {
    console.log('req', req);
    const { name, email, body } = req.body;
    if (!name || !email || !body) {
      res.status(400).json({
        error: 'validate error',
      });
      return;
    }
    const request = await axios.post(
      `${endpoint}databases/${databaseId}/form`,
      {
        name: name ?? '',
        email: email ?? '',
        body: body ?? '',
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
    res.status(200).json(json);
  }
  res.status(200).json({});
}
