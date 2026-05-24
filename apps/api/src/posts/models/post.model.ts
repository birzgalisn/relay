import { Field, ID, ObjectType } from '@nestjs/graphql';

import { PostFileModel } from './post-file.model';

@ObjectType('PostModel')
export class PostModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  caption!: string | null;

  @Field(() => [PostFileModel])
  files!: PostFileModel[];

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
