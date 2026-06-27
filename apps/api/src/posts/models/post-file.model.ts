import { Field, ID, Int, ObjectType, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { MediaService } from '../../infrastructure/media/services/media.service';
import { PostFileUploadStatus } from '../enums/file-upload-status.enum';

@ObjectType('PostFile')
export class PostFile {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  tusUploadId!: string | null;

  @Field(() => PostFileUploadStatus)
  uploadStatus!: PostFileUploadStatus;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => String, { nullable: true })
  mimeType!: string | null;

  @Field(() => Int, { nullable: true })
  byteSize!: number | null;

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
    const tusUploadId = file.tusUploadId;

    const urlAllowed = file.uploadStatus === PostFileUploadStatus.READY;

    if (!urlAllowed || !tusUploadId) {
      return null;
    }

    return this.media.getUrl(tusUploadId);
  }
}
