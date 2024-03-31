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
  const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
  if (req.method === 'POST') {
    const request = await axios.post(
      `${endpoint}databases/${databaseId}/form`,
      {
        headers: {
          notionApiKey: apiKey,
        },
        json: {
          name: req.query.name,
          email: req.query.email,
          body: req.query.body,
        },
      }
    );
    const json = await request.data;
    res.status(200).json(json);
  }
  res.status(200).json({});
}
