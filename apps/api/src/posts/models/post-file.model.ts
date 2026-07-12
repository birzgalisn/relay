import { Field, ID, Int, ObjectType, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { getPostFileThumbnailStorageKey, POST_FILE_THUMBNAIL_SIZES } from '@repo/shared';

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

  @Field(() => Date, { nullable: true })
  validatedAt!: Date | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => String, { nullable: true })
  src?: string | null;

  @Field(() => String, { nullable: true })
  srcSet?: string | null;
}

@Resolver(() => PostFile)
export class PostFileResolver {
  constructor(private readonly media: MediaService) {}

  @ResolveField(() => String, { nullable: true })
  url(@Parent() file: PostFile): string | null {
    return file.storageKey ? this.media.url(file.storageKey) : null;
  }

  @ResolveField(() => String, { nullable: true })
  src(@Parent() file: PostFile): string | null {
    if (file.validatedAt) {
      const smKey = getPostFileThumbnailStorageKey({ postFileId: file.id, size: 'sm' });
      return this.media.url(smKey);
    }

    return file.storageKey ? this.media.url(file.storageKey) : null;
  }

  @ResolveField(() => String, { nullable: true })
  srcSet(@Parent() file: PostFile): string | null {
    if (!file.validatedAt) {
      return null;
    }

    return POST_FILE_THUMBNAIL_SIZES.map(({ size, width }) => {
      const storageKey = getPostFileThumbnailStorageKey({ postFileId: file.id, size });
      const url = this.media.url(storageKey);
      return url ? `${url} ${width}w` : null;
    })
      .filter((entry): entry is string => entry != null)
      .join(', ');
  }
}
