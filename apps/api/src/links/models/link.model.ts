import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Link')
export class Link {
  @Field(() => ID)
  id!: string;

  @Field()
  url!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;
}
