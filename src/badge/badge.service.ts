import { Injectable, Logger } from '@nestjs/common';
import { SVGService } from './svg.service';
import { VelogAPIService } from './velog-api.service';
import { RSSParserService } from 'src/utils/rss-parser';
import { Feed, FeedItem } from 'src/interfaces/feed-item.interface';

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);

  constructor(
    private readonly rssParserService: RSSParserService,
    private readonly velogAPIService: VelogAPIService,
    private readonly svgService: SVGService,
  ) {}

  async generateBadge(username: string, theme: string, posts: number): Promise<string> {
    try {
      const [feed, totalLikes, tags] = await Promise.all([
        this.getFeed(username),
        this.velogAPIService.getTotalLikes(username),
        this.velogAPIService.getPopularTags(username),
      ]);

      const recentPosts = this.getRecentPosts(feed.items, posts);
      console.log(recentPosts)
      
      return this.svgService.generateSVG(username, recentPosts, theme, totalLikes, tags);
    } catch (error) {
      this.logger.error(`Error generating badge for ${username}: ${error.message}`);
      throw error;
    }
  }

  private async getFeed(username: string): Promise<Feed> {
    try {
      return await this.rssParserService.parseRSS(`https://v2.velog.io/rss/${username}`);
    } catch (error) {
      this.logger.error(`Error fetching RSS feed for ${username}: ${error.message}`);
      return { items: [] };
    }
  }

  private getRecentPosts(items: FeedItem[], count: number): FeedItem[] {
    return items.slice(0, count);
  }
}