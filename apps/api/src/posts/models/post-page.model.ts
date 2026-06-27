import { Field, ObjectType } from '@nestjs/graphql';

import { Post } from './post.model';

@ObjectType('PostPage')
export class PostPage {
  @Field(() => [Post])
  nodes!: Post[];

  @Field(() => String, { nullable: true })
  nextCursor!: string | null;

  @Field(() => Boolean)
  hasNextPage!: boolean;
}
