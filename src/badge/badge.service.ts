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
    query GetUserPosts($username: String!, $cursor: ID) {
      userPosts(username: $username, cursor: $cursor) {
        posts {
          id
          likes
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `;

  let totalLikes = 0;
  let hasNextPage = true;
  let cursor = null;

  try {
    while (hasNextPage) {
      const response = await axios.post(this.VELOG_API_ENDPOINT, {
        query,
        variables: { username, cursor },
      });

      const { posts, pageInfo } = response.data.data.userPosts;
      totalLikes += posts.reduce((sum, post) => sum + post.likes, 0);

      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;
    }

    return totalLikes;
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