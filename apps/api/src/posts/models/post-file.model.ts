import { Field, ID, Int, ObjectType, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { MediaService } from '../../infrastructure/media/services/media.service';
import { MediaMimeType } from '../enums/media-mime-type.enum';

@ObjectType('PostFile')
export class PostFile {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => MediaMimeType, { nullable: true })
  mimeType!: MediaMimeType | null;

  storageKey!: string | null;

  @Field(() => Int, { nullable: true })
  byteSize!: number | null;

  validatedAt!: Date | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => String, { nullable: true })
  url?: string | null;
}

@Resolver(() => PostFile)
export class PostFileResolver {
  constructor(private readonly media: MediaService) {}

  @ResolveField(() => String, { nullable: true })
  url(@Parent() file: PostFile): string | null {
    if (file.storageKey && file.validatedAt) {
      return this.media.url(file.storageKey);
    }

    return null;
  }
}
