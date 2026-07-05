import { Module } from '@nestjs/common';

import { mediaConfig } from '../../infrastructure/config/media.config';
import { MediaModule } from '../../infrastructure/media/media.module';
import { NsfwModule } from '../../infrastructure/nsfw/nsfw.module';
import { ValidatePostFileImageProcessor } from '../processors/validate-post-file-image.processor';
import { EnqueuePostFileImageValidationService } from '../services/enqueue-post-file-image-validation.service';
import { PostFilesTusHooks } from '../tus/post-files-tus.hooks';
import { FinishPostFileUploadUseCase } from '../use-cases/finish-post-file-upload.use-case';
import { MarkPostFileValidatedUseCase } from '../use-cases/mark-post-file-validated.use-case';
import { ModeratePostUseCase } from '../use-cases/moderate-post.use-case';
import { ResolvePostStatusUseCase } from '../use-cases/resolve-post-status.use-case';
import { ValidatePostFileImageUseCase } from '../use-cases/validate-post-file-image.use-case';

const mediaProvider = mediaConfig.asProvider();

@Module({
  imports: [MediaModule, NsfwModule, ...mediaProvider.imports],
  providers: [
    PostFilesTusHooks,
    EnqueuePostFileImageValidationService,
    FinishPostFileUploadUseCase,
    MarkPostFileValidatedUseCase,
    ModeratePostUseCase,
    ResolvePostStatusUseCase,
    ValidatePostFileImageUseCase,
    ValidatePostFileImageProcessor,
  ],
  exports: [PostFilesTusHooks],
})
export class PostFileUploadModule {}
