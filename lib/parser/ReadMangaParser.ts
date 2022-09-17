import { load } from 'cheerio';

export interface Chapter {
  title: string;
  pages: string[];
  translator?: string;
}

export interface Manga {
  title: string;
  chapters: Chapter[];
}

type Fetch = typeof fetch;

export class ReadMangaParser {
  private fetch: Fetch;

  constructor(fetch: Fetch) {
    this.fetch = fetch;
  }

  private async loadHtml(url: string): Promise<string> {
    return this.fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        Accept:
          'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8'
      }
    }).then((r) => r.text());
  }

  async parse(url: URL): Promise<Manga> {
    const html = await this.loadHtml(url.toString());
    const $ = load(html);
    const chapters: Chapter[] = await Promise.all(
      $('.chapters-link td a')
        .toArray()
        .map((e) => $(e))
        .map(
          async (e): Promise<Chapter> => ({
            translator: e.attr('title'),
            title: e.text(),
            pages: await this.parsePages(url.origin + e.attr('href'))
          })
        )
    );

    const selector = '#mangaBox > div.leftContent > meta[itemprop="name"]';

    return {
      title: $(selector).attr('content'),
      chapters
    };
  }

  async parsePages(chapterUrl: string): Promise<string[]> {
    const url = new URL(chapterUrl);
    url.searchParams.set('mtr', '1');
    const html = await this.loadHtml(url.toString());
    const $ = load(html);
    const selector = '.pageBlock.reader-bottom.container > script';
    const script = $(selector).html();
    const [, arrString] =
      script?.match(/rm_h\.initReader\( \[2,3],(.*), 0, false/) || [];

    // eslint-disable-next-line no-eval
    const arr: string[][] = eval(arrString);
    return arr.map(([a, , b]) => a + b);
  }
}
