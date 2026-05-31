import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { mediaConfig } from '../infrastructure/config/media.config';
import { IteratorModule } from '../infrastructure/iterator/iterator.module';
import { MediaCoreModule } from '../infrastructure/media/media-core.module';
import { NsfwModule } from '../infrastructure/nsfw/nsfw.module';
import { POST_FILE_IMAGE_VALIDATION_QUEUE } from '../infrastructure/queue/queue.tokens';
import { TusArtifactsModule } from '../infrastructure/tus/tus-artifacts.module';
import { PostFileUploadHandler } from './handlers/post-file-upload.handler';
import { PostFileResolver } from './models/post-file.model';
import { PostsResolver } from './posts.resolver';
import { ValidatePostFileImageProcessor } from './processors/validate-post-file-image.processor';
import { EnqueuePostFileImageValidationService } from './services/enqueue-post-file-image-validation.service';
import { CreatePostUseCase } from './use-cases/create-post.use-case';
import { DeletePostUseCase } from './use-cases/delete-post.use-case';
import { FinishPostFileUploadUseCase } from './use-cases/finish-post-file-upload.use-case';
import { GetPostUseCase } from './use-cases/get-post.use-case';
import { ListPostsUseCase } from './use-cases/list-posts.use-case';
import { ValidatePostFileImageUseCase } from './use-cases/validate-post-file-image.use-case';

const mediaProvider = mediaConfig.asProvider();

@Module({
  imports: [
    IteratorModule,
    MediaCoreModule,
    TusArtifactsModule,
    NsfwModule,
    ...mediaProvider.imports,
    BullModule.registerQueue({ name: POST_FILE_IMAGE_VALIDATION_QUEUE }),
  ],
  providers: [
    PostFileResolver,
    PostsResolver,
    ListPostsUseCase,
    CreatePostUseCase,
    GetPostUseCase,
    DeletePostUseCase,
    FinishPostFileUploadUseCase,
    ValidatePostFileImageUseCase,
    ValidatePostFileImageProcessor,
    EnqueuePostFileImageValidationService,
    PostFileUploadHandler,
  ],
  exports: [PostFileUploadHandler, FinishPostFileUploadUseCase],
})
export class PostsModule {}
