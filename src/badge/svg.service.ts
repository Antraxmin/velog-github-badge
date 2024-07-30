import { Injectable } from '@nestjs/common';
import { generateSVG as generateSVGUtil } from '../utils/svg-generator';
import { FeedItem } from 'src/interfaces/feed-item.interface';

@Injectable()
export class SVGService {
  generateSVG(username: string, items: FeedItem[], theme: string, totalLikes: number, tags: string[]): string {
    return generateSVGUtil(username, items, theme, totalLikes, tags);
  }
}