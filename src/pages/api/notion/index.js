import { NotionClient } from '@hooks/useNotion';
import Cors from 'cors';

// Notion API側がCORSを無効にしていて実行不可だったため実装中止 2021.11.2
// https://github.com/makenotion/notion-sdk-js/issues/96

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  // console.log(
  //   `key:${process.env.NEXT_PUBLIC_NOTION_KEY} id:${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`
  // );
  const { addTableItem } = NotionClient(
    process.env.NEXT_PUBLIC_NOTION_KEY,
    process.env.NEXT_PUBLIC_NOTION_DATABASE_ID
  );
  // console.log(req.method);
  if (req.method === 'POST') {
    // console.log(req.body);
    let submitData = {};

    let param = req.body.params ? req.body.params : req.body;

    if (param.text) {
      submitData = {
        ...submitData,
        名前: {
          title: [
            {
              text: {
                content: param.text,
              },
            },
          ],
        },
      };
    }
    if (param.name) {
      submitData = {
        ...submitData,
        name: {
          title: [
            {
              text: {
                content: param.name,
              },
            },
          ],
        },
      };
    }
    if (param.mail) {
      submitData = {
        ...submitData,
        mail: {
          email: param.mail,
        },
      };
    }
    if (param.body) {
      submitData = {
        ...submitData,
        body: {
          rich_text: [
            {
              text: {
                content: param.body,
              },
            },
          ],
        },
      };
    }
    // console.log(submitData);
    if (submitData) {
      await addTableItem(submitData);
      res.status(200).json([submitData]);
      return;
    }
  }
  res.status(200).json([]);
}
