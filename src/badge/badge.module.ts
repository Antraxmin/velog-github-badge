import { Module } from '@nestjs/common';
import { BadgeController } from './badge.controller';
import { BadgeService } from './badge.service';
import { RSSParserService } from 'src/utils/rss-parser';
import { VelogAPIService } from './velog-api.service';
import { SVGService } from './svg.service';

@Module({
  controllers: [BadgeController],
  providers: [BadgeService,
    RSSParserService,
    VelogAPIService,
    SVGService],
})
export class BadgeModule {}