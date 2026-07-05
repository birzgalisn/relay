import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: true })
  caption?: string | null;

  @Field(() => Int, { description: 'Number of files to upload' })
  files?: number | null;
}
