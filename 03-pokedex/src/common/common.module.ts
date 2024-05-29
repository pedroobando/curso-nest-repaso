import { Module } from '@nestjs/common';
import { AxiosAdapter, FetchAdapter } from './adapters';

@Module({
  providers: [AxiosAdapter, FetchAdapter],
  exports: [AxiosAdapter, FetchAdapter],
})
export class CommonModule {}
