import { Field, ObjectType } from '@nestjs/graphql';

import { PostModel } from './post.model';

@ObjectType('PostPage')
export class PostPageModel {
  @Field(() => [PostModel])
  nodes!: PostModel[];

  @Field(() => String, { nullable: true })
  nextCursor!: string | null;

  @Field(() => Boolean)
  hasNextPage!: boolean;
}
