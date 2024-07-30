import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { GET_USER_POSTS, GET_POPULAR_TAGS } from '../constants/graphql-queries';
import { Post, Tag } from 'src/interfaces/velog-api.interface';

interface VelogPost {
    id: string;
    title: string;
    likes: number;
  }

@Injectable()
export class VelogAPIService {
  private readonly logger = new Logger(VelogAPIService.name);
  private readonly VELOG_API_ENDPOINT = 'https://v2.velog.io/graphql';

  async getPostsWithLikes(username: string): Promise<VelogPost[]> {
    const query = `
      query {
        posts(username: "${username}") {
          id
          title
          likes
        }
      }
    `;

    try {
      const response = await axios.post(this.VELOG_API_ENDPOINT, { query });
      return response.data.data.posts;
    } catch (error) {
      this.logger.error(`Error fetching posts for ${username}: ${error.message}`);
      throw error;
    }
  }

  async getTotalLikes(username: string): Promise<number> {
    try {
      const posts = await this.getPostsWithLikes(username);
      return posts.reduce((sum, post) => sum + post.likes, 0);
    } catch (error) {
      this.logger.error(`Error calculating total likes for ${username}: ${error.message}`);
      throw error;
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
      console.log('Full GraphQL Response:', JSON.stringify(response.data, null, 2));
  
      const { posts, pageInfo } = response.data.data.userPosts;
      console.log('Extracted Posts:', JSON.stringify(posts, null, 2));
  
      allPosts = [...allPosts, ...posts];
      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;
    }
  
    return allPosts;
  }

  private calculateTotalLikes(posts: Post[]): number {
    this.logger.debug(`Calculating total likes for ${posts.length} posts`);
    
    return posts.reduce((sum, post, index) => {
      if (typeof post.likes !== 'number') {
        this.logger.warn(`Post at index ${index} has invalid 'likes' value: ${post.likes}`);
        return sum;
      }
      
      console.log(`Post ${index + 1}: ID=${post.id}, Likes=${post.likes}`);
      return sum + post.likes;
    }, 0);
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