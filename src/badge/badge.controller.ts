import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { BadgeService } from './badge.service';

@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get(':username')
  async getBadge(
    @Param('username') username: string,
    @Query('theme') theme: string = 'light',
    @Query('posts') posts: number = 5,
    @Res() res: Response,
  ) {
    const svg = await this.badgeService.generateBadge(username, theme, posts);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.send(svg);
  }
}