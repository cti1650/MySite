import { fetchPortfolios } from '@lib/portfolioApi';
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
  if (req.method === 'GET') {
    const portfolios = await fetchPortfolios();
    res.status(200).json(portfolios);
  }
  res.status(200).json([]);
}
