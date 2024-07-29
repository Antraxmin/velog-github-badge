import { Module } from '@nestjs/common';
import { BadgeModule } from './badge/badge.module';

@Module({
  imports: [BadgeModule],
})
export class AppModule {}