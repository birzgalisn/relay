import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { PostFeedCreatedModel } from './models/post-feed-created.model';
import type { PostFeedEventModel } from './models/post-feed-event.union';
import { PostFeedRemovedModel } from './models/post-feed-removed.model';
import type { PostModel } from './models/post.model';

const POST_FEED_UPDATED = 'postFeedUpdated';

type PostFeedUpdatedPayload = {
  postFeedUpdated: PostFeedEventModel;
};

@Injectable()
export class PostsFeedPubSubService {
  private readonly pubSub = new PubSub();

  postFeedUpdated() {
    return this.pubSub.asyncIterableIterator<PostFeedUpdatedPayload>(POST_FEED_UPDATED);
  }

  async publishCreated(post: PostModel): Promise<void> {
    await this.pubSub.publish(POST_FEED_UPDATED, {
      postFeedUpdated: new PostFeedCreatedModel(post),
    });
  }

  async publishRemoved(id: string): Promise<void> {
    await this.pubSub.publish(POST_FEED_UPDATED, {
      postFeedUpdated: new PostFeedRemovedModel({ id }),
    });
  }
}
