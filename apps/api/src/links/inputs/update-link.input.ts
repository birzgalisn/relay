import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateLinkInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  description?: string;
}
