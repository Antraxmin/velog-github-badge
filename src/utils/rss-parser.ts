import { Injectable, Logger } from '@nestjs/common';
import Parser from 'rss-parser';
import { Feed, FeedItem } from '../interfaces/feed-item.interface';

@Injectable()
export class RSSParserService {
  private readonly parser = new Parser();
  private readonly logger = new Logger(RSSParserService.name);

  async parseRSS(url: string): Promise<Feed> {
    try {
      const feed = await this.parser.parseURL(url);
      return {
        items: feed.items.map((item: any): FeedItem => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          likes: item.likes || '',
        })),
      };
    } catch (error) {
      this.logger.error(`Failed to parse RSS feed from ${url}: ${error.message}`);
      throw error;
    }
  }
}