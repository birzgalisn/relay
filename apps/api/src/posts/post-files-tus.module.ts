import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { POST_FILE_MAX_UPLOAD_BYTES } from '@repo/shared';

import { mediaConfig } from '../infrastructure/config/media.config';
import { TusModule } from '../infrastructure/tus/tus.module';
import { PostFileUploadModule } from './post-file-upload.module';
import { EnqueuePostFileImageValidationService } from './services/enqueue-post-file-image-validation.service';
import { FinishPostFileUploadUseCase } from './use-cases/finish-post-file-upload.use-case';
import { ResolvePostStatusUseCase } from './use-cases/resolve-post-status.use-case';

/** Dedicated tus endpoint for post file uploads (not shared with other upload domains). */
export const POST_FILES_TUS_PATH = '/posts/files';

const mediaProvider = mediaConfig.asProvider();

@Module({
  imports: [
    PostFileUploadModule,
    TusModule.registerAsync({
      imports: [PostFileUploadModule, ...mediaProvider.imports],
      inject: [
        FinishPostFileUploadUseCase,
        EnqueuePostFileImageValidationService,
        ResolvePostStatusUseCase,
        ...mediaProvider.inject,
      ],
      useFactory(
        finishPostFileUpload: FinishPostFileUploadUseCase,
        enqueueImageValidation: EnqueuePostFileImageValidationService,
        resolvePostStatus: ResolvePostStatusUseCase,
        media: ConfigType<typeof mediaConfig>,
      ) {
        return {
          root: media.root,
          path: POST_FILES_TUS_PATH,
          maxUploadBytes: POST_FILE_MAX_UPLOAD_BYTES,
          async onUploadFinish(_req, upload) {
            const { postId, validationJob } = await finishPostFileUpload.execute(upload);

            if (validationJob) {
              await enqueueImageValidation.enqueue(validationJob);
            }

            await resolvePostStatus.execute(postId);
            return {};
          },
        };
      },
    }),
  ],
})
export class PostFilesTusModule {}
