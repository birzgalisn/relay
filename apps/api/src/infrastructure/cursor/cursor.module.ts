import { Module } from '@nestjs/common';

import { CursorService } from './services/cursor.service';

@Module({
  providers: [CursorService],
  exports: [CursorService],
})
export class CursorModule {}
