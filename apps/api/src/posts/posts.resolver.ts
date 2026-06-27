import { Args, ID, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { createPostInputSchema, type CreatePostInput } from '@repo/shared';

import { createZodValidationPipe } from '../infrastructure/validation/create-zod-validation-pipe';
import { CreatePostInput as CreatePostInputType } from './interfaces/create-post.input';
import { ListPostsArgs } from './interfaces/list-posts.args';
import { PostFeedEventUnion, type PostFeedEventModel } from './models/post-feed-event.union';
import { PostPageModel } from './models/post-page.model';
import { PostModel } from './models/post.model';
import { PostsFeedPubSubService } from './posts-feed-pubsub.service';
import { CreatePostUseCase } from './use-cases/create-post.use-case';
import { DeletePostUseCase } from './use-cases/delete-post.use-case';
import { GetPostUseCase } from './use-cases/get-post.use-case';
import { ListPostsUseCase } from './use-cases/list-posts.use-case';

@Resolver()
export class PostsResolver {
  constructor(
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly getPostUseCase: GetPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly postsFeedPubSub: PostsFeedPubSubService,
  ) {}

  @Query(() => PostPageModel)
  posts(@Args() args: ListPostsArgs): Promise<PostPageModel> {
    return this.listPostsUseCase.execute(args);
  }

  @Query(() => PostModel, { nullable: true })
  post(@Args('id', { type: () => ID }) id: string): Promise<PostModel | null> {
    return this.getPostUseCase.execute(id);
  }

  @Mutation(() => PostModel)
  createPost(
    @Args(
      'input',
      { type: () => CreatePostInputType },
      createZodValidationPipe(createPostInputSchema),
    )
    input: CreatePostInput,
  ): Promise<PostModel> {
    return this.createPostUseCase.execute(input);
  }

  @Mutation(() => Boolean)
  async deletePost(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.deletePostUseCase.execute(id);
    return true;
  }

  @Subscription(() => PostFeedEventUnion, {
    resolve: (payload: { postFeedUpdated: PostFeedEventModel }) => payload.postFeedUpdated,
  })
  postsFeed(@Args() _args: ListPostsArgs) {
    return this.postsFeedPubSub.postFeedUpdated();
  }
}
