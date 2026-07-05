import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { POST_FILE_MAX_UPLOAD_BYTES } from '@repo/shared';

import { mediaConfig } from '../../infrastructure/config/media.config';
import { MediaModule } from '../../infrastructure/media/media.module';
import { TusModule } from '../../infrastructure/tus/tus.module';
import { PostFilesTusHooks } from '../tus/post-files-tus.hooks';
import { PostFileUploadModule } from './post-file-upload.module';

/** Dedicated tus endpoint for post file uploads (not shared with other upload domains). */
export const POST_FILES_TUS_PATH = '/posts/files';

const mediaProvider = mediaConfig.asProvider();

@Module({
  imports: [
    PostFileUploadModule,
    MediaModule,
    TusModule.registerAsync({
      imports: [PostFileUploadModule, MediaModule, ...mediaProvider.imports],
      inject: [PostFilesTusHooks, ...mediaProvider.inject],
      useFactory(hooks: PostFilesTusHooks, media: ConfigType<typeof mediaConfig>) {
        return {
          root: media.root,
          path: POST_FILES_TUS_PATH,
          maxUploadBytes: POST_FILE_MAX_UPLOAD_BYTES,
          onUploadCreate: hooks.onUploadCreate.bind(hooks),
          onUploadFinish: hooks.onUploadFinish.bind(hooks),
        };
      },
    }),
  ],
})
export class PostFilesTusModule {}
