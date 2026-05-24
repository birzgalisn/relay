import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: true })
  caption?: string | null;

  @Field(() => Int, { nullable: true })
  fileCount?: number | null;
}
