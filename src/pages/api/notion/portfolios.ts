import { fetchPortfolios } from '@lib/portfolioApi';
import type { NextApiRequest, NextApiResponse } from 'next';

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
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === 'GET') {
    try {
      const portfolios = await fetchPortfolios();
      res.status(200).json(portfolios);
    } catch (_e) {
      res.status(400).json([]);
    }
    return;
  }
  res.status(200).json([]);
}
