import { NextApiRequest, NextApiResponse } from 'next';
import { ReadMangaParser } from '@/lib/parser/ReadMangaParser';

interface ParseRequest extends NextApiRequest {
  query: { url: string };
}

export default async (
  req: ParseRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'GET') {
    const url = new URL(req.query.url);
    console.log(req.query.url);
    console.log(url.toString());
    if (
      ['readmanga.live', 'mintmanga.live'].some((u) => url.hostname.includes(u))
    ) {
      try {
        const readMangaParser = new ReadMangaParser(fetch);
        const manga = await readMangaParser.parse(url);
        res.setHeader('Cache-Control', 'public, max-age=100000');

        res.status(200).json({
          manga
        });
      } catch (error) {
        res.status(500).json({ error: 'Parsing error' });
        throw error;
      }
    } else {
      res.status(400).json({ error: 'Can not parse' });
    }
  } else {
    res.status(404).end();
  }
};
