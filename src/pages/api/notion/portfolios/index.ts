import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  description: string;
  github: string;
  img: string;
  link: string;
  name: string;
  rawTags: { color: string; colorCode: string; name: string }[];
  rawType: { color: string; colorCode: string; name: string };
  tags: string[];
  type: string;
}[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const endpoint = process.env.NEXT_PUBLIC_NOTION_BACKEND_ENDPOINT;
  const apiKey = process.env.NEXT_PUBLIC_NOTION_KEY;
  const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
  if (req.method === 'GET') {
    const request = await axios.get(
      `${endpoint}databases/${databaseId}/portfolios`,
      {
        headers: {
          notionApiKey: apiKey,
        },
      }
    );
    const json = await request.data;
    res.status(200).json(json);
  }
  res.status(200).json([]);
}
