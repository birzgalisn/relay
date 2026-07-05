import { Global, Module } from '@nestjs/common';

import { PostEventsService } from '../services/post-events.service';

@Global()
@Module({
  providers: [PostEventsService],
  exports: [PostEventsService],
})
export class PostEventsModule {}
