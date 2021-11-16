import { Client } from '@notionhq/client';

type TypeNotionBodyParamsOption = {
  database_id: string;
  filter?: any;
  sorts?: any[];
  start_cursor?: string;
  page_size?: number;
};

export const twNotionTagColor = {
  'light gray': 'bg-gray-50',
  'gray': 'bg-gray-700 bg-opacity-25',
  'brown': 'bg-yellow-900 bg-opacity-25',
  'orange': 'bg-yellow-600 bg-opacity-25',
  'yellow': 'bg-yellow-400 bg-opacity-25',
  'green': 'bg-green-700 bg-opacity-25',
  'blue': 'bg-blue-700 bg-opacity-25',
  'purple': 'bg-pink-800 bg-opacity-25',
  'pink': 'bg-pink-300 bg-opacity-25',
  'red': 'bg-red-600 bg-opacity-25'
};

const findValue = (property) => {
  switch (property.type) {
    case 'title':
    case 'rich_text':
      return property[property.type][0]?.text.content || '';
      break;
    case 'number':
      return property.number || '';
      break;
    case 'date':
      return property.date || '';
      break;
    case 'url':
      return property.url || '';
      break;
    case 'files':
      return property.files?.map(file=>file.name) || [];
      break;
    case 'select':
      return property.select?.name || '';
      break;
    case 'relation':
      return property.relation || [];
      break;
    case 'formula':
      return findValue(property.formula) || '';
      break;
    case 'multi_select':
      return property.multi_select || [];
      break;
    default:
      return property;
  }
};

// developers.notion - Query a database
// https://developers.notion.com/reference/post-database-query

export const NotionDatabaseClient = async ({
  database_id,
  filter,
  sorts,
  start_cursor,
  page_size,
}: TypeNotionBodyParamsOption) => {
  const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_KEY });

  // developers.notion - Database object
  // https://developers.notion.com/reference/database

  let databaseData = null;
  let responseData = [];
  try {
    databaseData = await notion.databases
      .query({
        database_id: database_id,
        filter: filter,
        sorts: sorts,
        start_cursor: start_cursor,
        page_size: page_size,
      } as TypeNotionBodyParamsOption)

    responseData = databaseData['results'].map((item) => {
        const propList: any = item['properties'];
        let response = {};
        Object.keys(propList).map((value) => {
          response = {
            ...response,
            [value]: findValue(propList[value]),
          };
        });
        return response;
      });
      return { propertyValues:responseData, properties : databaseData?['results'].map(item => item['properties']) };
  } catch (error) {
    console.error(error.body);
  }
  return { propertyValues:[],properties:[] };
};
