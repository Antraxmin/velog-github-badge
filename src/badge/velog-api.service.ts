import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { GET_USER_POSTS, GET_POPULAR_TAGS } from '../constants/graphql-queries';
import { Post, Tag } from 'src/interfaces/velog-api.interface';


@Injectable()
export class VelogAPIService {
  private readonly logger = new Logger(VelogAPIService.name);
  private readonly VELOG_API_ENDPOINT = 'https://v2.velog.io/graphql';

  async getTotalLikes(username: string): Promise<number> {
    try {
      const posts = await this.fetchAllPosts(username);
      return this.calculateTotalLikes(posts);
    } catch (error) {
      this.logger.error(`Error fetching total likes for ${username}: ${error.message}`);
      return 0;
    }
  }

  async getPopularTags(username: string): Promise<string[]> {
    try {
      const tags = await this.fetchUserTags(username);
      return this.getTopTags(tags);
    } catch (error) {
      this.logger.error(`Error fetching popular tags for ${username}: ${error.message}`);
      return [];
    }
  }

  private async fetchAllPosts(username: string): Promise<Post[]> {
    let allPosts: Post[] = [];
    let hasNextPage = true;
    let cursor = null;

    while (hasNextPage) {
      const response = await this.queryGraphQL(GET_USER_POSTS, { username, cursor });
      const { posts, pageInfo } = response.data.data.userPosts;
      allPosts = [...allPosts, ...posts];
      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;
    }

    return allPosts;
  }

  private calculateTotalLikes(posts: Post[]): number {
    return posts.reduce((sum, post) => sum + post.likes, 0);
  }

  private async fetchUserTags(username: string): Promise<Tag[]> {
    const response = await this.queryGraphQL(GET_POPULAR_TAGS, { username });
    return response.data.data.userTags.tags;
  }

  private getTopTags(tags: Tag[]): string[] {
    return tags
      .sort((a, b) => b.posts_count - a.posts_count)
      .slice(0, 3)
      .map(tag => tag.name);
  }

  private async queryGraphQL(query: string, variables: any): Promise<any> {
    try {
      return await axios.post(this.VELOG_API_ENDPOINT, { query, variables });
    } catch (error) {
      this.logger.error(`GraphQL query failed: ${error.message}`);
      throw error;
    }
  }
}