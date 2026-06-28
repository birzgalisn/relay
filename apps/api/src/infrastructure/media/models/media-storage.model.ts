import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType('MediaStorage')
export class MediaStorage {
  @Field(() => Float)
  totalBytes!: number;

  @Field(() => Float)
  usedBytes!: number;

  @Field(() => Float)
  availableBytes!: number;

  @Field(() => Float)
  reserveBytes!: number;

  /** Whether any uploadable space remains beyond the reserve. */
  @Field(() => Boolean)
  uploadAllowed!: boolean;
}
