import Parser from 'rss-parser';

const parser = new Parser();

export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
}

export interface Feed {
  items: FeedItem[];
}

export async function parseRSS(url: string): Promise<Feed> {
  const feed = await parser.parseURL(url);
  return {
    items: feed.items.map((item): FeedItem => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
    })),
  };
}