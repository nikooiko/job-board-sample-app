import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SvcSearchService } from './services/svc-search.service';
import searchConfig from './config/svc-search.config';

@Module({
  imports: [ConfigModule.forFeature(searchConfig), HttpModule],
  providers: [SvcSearchService],
  exports: [SvcSearchService],
})
export class SvcSearchModule {}
