import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import type { PostFeedUpdatedPayload } from '../interfaces/post-feed-updated-payload.interface';
import { PostCreated } from '../models/post-created.model';
import { PostRemoved } from '../models/post-removed.model';
import type { Post } from '../models/post.model';

const POST_FEED_UPDATED = 'postFeedUpdated';

@Injectable()
export class PostEventsService {
  private readonly pubSub = new PubSub();

  postFeedUpdated() {
    return this.pubSub.asyncIterableIterator<PostFeedUpdatedPayload>(POST_FEED_UPDATED);
  }

  async broadcastCreated(post: Post): Promise<void> {
    await this.pubSub.publish(POST_FEED_UPDATED, {
      postFeedUpdated: new PostCreated(post),
    });
  }

  async broadcastRemoved(id: string): Promise<void> {
    await this.pubSub.publish(POST_FEED_UPDATED, {
      postFeedUpdated: new PostRemoved({ id }),
    });
  }
}
