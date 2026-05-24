import { Module } from '@nestjs/common';

import { CursorModule } from '../cursor/cursor.module';
import { PaginatedIteratorFactory } from './paginated-iterator.factory';

@Module({
  imports: [CursorModule],
  providers: [PaginatedIteratorFactory],
  exports: [PaginatedIteratorFactory],
})
export class IteratorModule {}
