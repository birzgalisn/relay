import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreatePostInput } from './interfaces/create-post.input';
import { ListPostsArgs } from './interfaces/list-posts.args';
import { PostPageModel } from './models/post-page.model';
import { PostModel } from './models/post.model';
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
  createPost(@Args('input') input: CreatePostInput): Promise<PostModel> {
    return this.createPostUseCase.execute(input);
  }

  @Mutation(() => Boolean)
  async deletePost(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.deletePostUseCase.execute(id);
    return true;
  }
}
