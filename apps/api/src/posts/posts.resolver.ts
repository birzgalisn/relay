import { Args, ID, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { createPostInputSchema, type CreatePostInput } from '@repo/shared';

import { createZodValidationPipe } from '../infrastructure/validation/create-zod-validation-pipe';
import { CreatePostInput as CreatePostInputType } from './interfaces/create-post.input';
import { ListPostsArgs } from './interfaces/list-posts.args';
import type { PostFeedUpdatedPayload } from './interfaces/post-feed-updated-payload.interface';
import { PostEventUnion } from './models/post-event.union';
import { PostPage } from './models/post-page.model';
import { Post } from './models/post.model';
import { PostEventsPubSubService } from './post-events-pubsub.service';
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
    private readonly postEventsPubSub: PostEventsPubSubService,
  ) {}

  @Query(() => PostPage)
  posts(@Args() args: ListPostsArgs): Promise<PostPage> {
    return this.listPostsUseCase.execute(args);
  }

  @Query(() => Post, { nullable: true })
  post(@Args('id', { type: () => ID }) id: string): Promise<Post | null> {
    return this.getPostUseCase.execute(id);
  }

  @Mutation(() => Post)
  createPost(
    @Args(
      'input',
      { type: () => CreatePostInputType },
      createZodValidationPipe(createPostInputSchema),
    )
    input: CreatePostInput,
  ): Promise<Post> {
    return this.createPostUseCase.execute(input);
  }

  @Mutation(() => Boolean)
  async deletePost(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.deletePostUseCase.execute(id);
    return true;
  }

  @Subscription(() => PostEventUnion, {
    resolve: (payload: PostFeedUpdatedPayload) => payload.postFeedUpdated,
  })
  postsFeed(@Args() _args: ListPostsArgs) {
    return this.postEventsPubSub.postFeedUpdated();
  }
}
