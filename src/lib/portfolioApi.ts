import axios from 'axios';

export type ResponseData = {
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

export async function fetchPortfolios(): Promise<ResponseData> {
  const endpoint = process.env.NOTION_BACKEND_ENDPOINT;
  const apiKey = process.env.NOTION_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;
  try {
    if (!endpoint || !apiKey || !databaseId) {
      return [];
    }
    const request = await axios.get(
      `${endpoint}databases/${databaseId}/portfolios`,
      {
        headers: {
          notionApiKey: apiKey,
        },
      },
    );
    const portfolios = await request.data;
    if (portfolios?.status || portfolios?.message) {
      return [];
    }
    return portfolios;
  } catch (e) {
    console.error(e);
    return [];
  }
}
