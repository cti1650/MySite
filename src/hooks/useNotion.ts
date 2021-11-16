import { Client } from '@notionhq/client';

export const useNotion = (accessKey = '') => {
  const key = accessKey === '' ? process.env.NEXT_PUBLIC_NOTION_KEY : accessKey;
  return new Client({ auth: key });
};

export const useNotionClient = (accessKey = '', databaseId) => {
  const notion = useNotion(accessKey);
  const getTable = async () => {
    try {
      const db = await notion.databases.query({ database_id: databaseId });
      return db['results'].map((item) => {
        return item;
      });
    } catch (error) {
      console.error(error.body);
      return [];
    }
  };

  const addTableItem = (properties = {}) => {
    try {
      const response = notion.pages.create({
        parent: { database_id: databaseId },
        properties: properties,
      });
      // console.log(response);
      // console.log('Success! Entry added.');
      return response;
    } catch (error) {
      console.error(error.body);
      return error.body;
    }
  };
  return { notion, getTable, addTableItem };
};
