import { Field, ID, ObjectType } from '@nestjs/graphql';

import { PostFile } from './post-file.model';

@ObjectType('Post')
export class Post {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  caption!: string | null;

  @Field(() => [PostFile])
  files!: PostFile[];

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  constructor(payload?: Partial<Post>) {
    Object.assign(this, payload);
  }
}
