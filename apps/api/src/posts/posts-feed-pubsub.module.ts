import { Global, Module } from '@nestjs/common';

import { PostsFeedPubSubService } from './posts-feed-pubsub.service';

@Global()
@Module({
  providers: [PostsFeedPubSubService],
  exports: [PostsFeedPubSubService],
})
export class PostsFeedPubSubModule {}
