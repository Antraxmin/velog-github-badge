import { Injectable } from '@nestjs/common';
import { parseRSS } from '../utils/rss-parser';
import { generateSVG } from '../utils/svg-generator';

@Injectable()
export class BadgeService {
  async generateBadge(username: string, theme: string, posts: number): Promise<string> {
    const feed = await parseRSS(`https://v2.velog.io/rss/${username}`);
    return generateSVG(feed.items.slice(0, posts), theme);
  }
}