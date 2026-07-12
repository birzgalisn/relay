import { Module } from '@nestjs/common';

import { mediaConfig } from '../../infrastructure/config/media.config';
import { MediaModule } from '../../infrastructure/media/media.module';
import { GeneratePostFileThumbnailsProcessor } from '../processors/generate-post-file-thumbnails.processor';
import { EnqueuePostFileThumbnailGenerationService } from '../services/enqueue-post-file-thumbnail-generation.service';
import { GeneratePostFileThumbnailsUseCase } from '../use-cases/generate-post-file-thumbnails.use-case';
import { MarkPostFileValidatedUseCase } from '../use-cases/mark-post-file-validated.use-case';

const mediaProvider = mediaConfig.asProvider();

@Module({
  imports: [MediaModule, ...mediaProvider.imports],
  providers: [
    EnqueuePostFileThumbnailGenerationService,
    GeneratePostFileThumbnailsUseCase,
    GeneratePostFileThumbnailsProcessor,
    MarkPostFileValidatedUseCase,
  ],
  exports: [EnqueuePostFileThumbnailGenerationService],
})
export class PostFileThumbnailModule {}
