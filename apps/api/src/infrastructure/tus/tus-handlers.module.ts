import { Module } from '@nestjs/common';

import { PostFileUploadHandler } from '../../posts/handlers/post-file-upload.handler';
import { PostsModule } from '../../posts/posts.module';
import type { TusUploadHandler } from './interfaces/tus-upload-handler.interface';
import { TUS_UPLOAD_HANDLERS } from './tus.tokens';

@Module({
  imports: [PostsModule],
  providers: [
    {
      provide: TUS_UPLOAD_HANDLERS,
      useFactory(posts: PostFileUploadHandler): TusUploadHandler[] {
        return [posts];
      },
      inject: [PostFileUploadHandler],
    },
  ],
  exports: [TUS_UPLOAD_HANDLERS],
})
export class TusHandlersModule {}
