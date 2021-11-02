import { useNotionClient } from '@hooks/useNotion';
import Cors from 'cors';

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST', 'OPTION', 'HEAD'],
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
  const { getTable, addTableItem } = useNotionClient(
    process.env.NEXT_PUBLIC_NOTION_KEY,
    process.env.NEXT_PUBLIC_NOTION_DATABASE_ID
  );
  // console.log(req.method);
  if (req.method === 'POST') {
    // console.log(req.body);
    let submitData = {};

    if (req.body.text) {
      submitData = {
        ...submitData,
        名前: {
          title: [
            {
              text: {
                content: req.body.text,
              },
            },
          ],
        },
      };
    }
    if (req.body.name) {
      submitData = {
        ...submitData,
        name: {
          title: [
            {
              text: {
                content: req.body.name,
              },
            },
          ],
        },
      };
    }
    if (req.body.mail) {
      submitData = {
        ...submitData,
        mail: {
          email: req.body.mail,
        },
      };
    }
    if (req.body.body) {
      submitData = {
        ...submitData,
        body: {
          rich_text: [
            {
              text: {
                content: req.body.body,
              },
            },
          ],
        },
      };
    }
    // console.log(submitData);
    if (submitData) {
      await addTableItem(submitData);
    }
  }
  getTable().then((db) => {
    // console.log(db);
    if (db) {
      res.status(200).json(db);
    } else {
      res.status(400).json([]);
    }
  });
}
