import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parseRSS, FeedItem } from '../utils/rss-parser';
import { generateSVG } from '../utils/svg-generator';

@Injectable()
export class BadgeService {
  private readonly VELOG_API_ENDPOINT = 'https://v2.velog.io/graphql';

  async generateBadge(username: string, theme: string, posts: number): Promise<string> {
    const feed = await parseRSS(`https://v2.velog.io/rss/${username}`);
    const totalLikes = await this.getTotalLikes(username);
    const tags = await this.getPopularTags(username);

    return generateSVG(username, feed.items.slice(0, posts), theme, totalLikes, tags);
  }

  private async getTotalLikes(username: string): Promise<number> {
    const query = `
      query GetTotalLikes($username: String!) {
        userProfile(username: $username) {
          totalLikes
        }
      }
    `;

    try {
      const response = await axios.post(this.VELOG_API_ENDPOINT, {
        query,
        variables: { username },
      });

      return response.data.data.userProfile.totalLikes;
    } catch (error) {
      console.error('Error fetching total likes:', error);
      return 0;
    }
  }

  private async getPopularTags(username: string): Promise<string[]> {
    const query = `
      query GetPopularTags($username: String!) {
        userTags(username: $username) {
          tags {
            name
            posts_count
          }
        }
      }
    `;

    try {
      const response = await axios.post(this.VELOG_API_ENDPOINT, {
        query,
        variables: { username },
      });

      const tags = response.data.data.userTags.tags;
      return tags
        .sort((a, b) => b.posts_count - a.posts_count)
        .slice(0, 3)
        .map(tag => tag.name);
    } catch (error) {
      console.error('Error fetching popular tags:', error);
      return [];
    }
  }
}