import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class ListPostsArgs {
  @Field(() => Int, { defaultValue: 10 })
  pageSize!: number;

  @Field(() => String, { nullable: true })
  cursor?: string | null;
}
