import axios from 'axios';

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

export async function fetchPortfolios(): Promise<ResponseData> {
  const endpoint = process.env.NEXT_PUBLIC_NOTION_BACKEND_ENDPOINT;
  const apiKey = process.env.NEXT_PUBLIC_NOTION_KEY;
  const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
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
      }
    );
    const portfolios = await request.data;
    return portfolios;
  } catch (e) {
    console.error(e);
    return [];
  }
}
