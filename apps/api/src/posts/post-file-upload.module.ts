import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { mediaConfig } from '../infrastructure/config/media.config';
import { NsfwModule } from '../infrastructure/nsfw/nsfw.module';
import { POST_FILE_IMAGE_VALIDATION_QUEUE } from '../infrastructure/queue/queue.tokens';
import { ValidatePostFileImageProcessor } from './processors/validate-post-file-image.processor';
import { EnqueuePostFileImageValidationService } from './services/enqueue-post-file-image-validation.service';
import { FinishPostFileUploadUseCase } from './use-cases/finish-post-file-upload.use-case';
import { MarkPostFileReadyUseCase } from './use-cases/mark-post-file-ready.use-case';
import { MarkPostFileRejectedUseCase } from './use-cases/mark-post-file-rejected.use-case';
import { ResolvePostStatusUseCase } from './use-cases/resolve-post-status.use-case';
import { ValidatePostFileImageUseCase } from './use-cases/validate-post-file-image.use-case';

const mediaProvider = mediaConfig.asProvider();

@Module({
  imports: [
    NsfwModule,
    BullModule.registerQueue({ name: POST_FILE_IMAGE_VALIDATION_QUEUE }),
    ...mediaProvider.imports,
  ],
  providers: [
    EnqueuePostFileImageValidationService,
    FinishPostFileUploadUseCase,
    MarkPostFileReadyUseCase,
    MarkPostFileRejectedUseCase,
    ResolvePostStatusUseCase,
    ValidatePostFileImageUseCase,
    ValidatePostFileImageProcessor,
  ],
  exports: [
    EnqueuePostFileImageValidationService,
    FinishPostFileUploadUseCase,
    ResolvePostStatusUseCase,
  ],
})
export class PostFileUploadModule {}
