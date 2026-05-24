import { Field, ID, Int, ObjectType, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { MediaService } from '../../infrastructure/media/media.service';
import { PostFileUploadStatus } from '../enums/post-file-upload-status.enum';

@ObjectType('PostFileModel')
export class PostFileModel {
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

@Resolver(() => PostFileModel)
export class PostFileResolver {
  constructor(private readonly media: MediaService) {}

  @ResolveField(() => String, { nullable: true })
  url(@Parent() file: PostFileModel): string | null {
    const tusUploadId = file.tusUploadId;

    if (file.uploadStatus !== PostFileUploadStatus.READY || !tusUploadId) {
      return null;
    }

    return this.media.getUrl(tusUploadId);
  }
}
