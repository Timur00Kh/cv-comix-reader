import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

export default (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method === 'GET') {
    const files = fs.readdirSync('./public/images');
    res.status(200).json(
      files.map((e) => ({
        name: e,
        path: `/images/${e}`
      }))
    );
  } else {
    res.status(404);
  }
};
