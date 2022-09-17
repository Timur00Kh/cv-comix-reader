import { NextApiRequest, NextApiResponse } from 'next';
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

interface ImageRequest extends NextApiRequest {
  query: { url: string };
}

export default async (
  req: ImageRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'GET') {
    const image = await fetch(req.query.url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        Accept:
          'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8'
      }
    }).then((r) => r.blob());
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    await pipeline(image.stream(), res);
  } else {
    res.status(404);
  }
};
