import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLinkInput {
  @Field()
  title!: string;

  @Field()
  url!: string;

  @Field()
  description!: string;
}
