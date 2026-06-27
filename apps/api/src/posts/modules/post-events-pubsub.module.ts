import { Global, Module } from '@nestjs/common';

import { PostEventsPubSubService } from '../services/post-events-pubsub.service';

@Global()
@Module({
  providers: [PostEventsPubSubService],
  exports: [PostEventsPubSubService],
})
export class PostEventsPubSubModule {}
