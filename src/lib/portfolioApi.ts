import axios from 'axios';
import { createCachedFetcher } from './cache';

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
    console.error('Failed to fetch portfolios:', e);
    return [];
  }
}

/**
 * ページ・llms.txt から使うキャッシュ付き取得。
 * 取得失敗時は空配列が返るため、最後に成功した一覧を返し続ける。
 */
export const getPortfolios = createCachedFetcher(fetchPortfolios, {
  ttlMs: 300 * 1000,
  isSuccess: (portfolios) => portfolios.length > 0,
});
