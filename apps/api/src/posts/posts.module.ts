import { Module } from '@nestjs/common';

import { mediaConfig } from '../infrastructure/config/media.config';
import { IteratorModule } from '../infrastructure/iterator/iterator.module';
import { MediaModule } from '../infrastructure/media/media.module';
import { PostFileResolver } from './models/post-file.model';
import { ModeratedPostCleanupModule } from './modules/moderated-post-cleanup.module';
import { PostEventsModule } from './modules/post-events.module';
import { PostFileUploadModule } from './modules/post-file-upload.module';
import { PostFilesTusModule } from './modules/post-files-tus.module';
import { PostsResolver } from './posts.resolver';
import { CreatePostUseCase } from './use-cases/create-post.use-case';
import { DeletePostUseCase } from './use-cases/delete-post.use-case';
import { GetPostUseCase } from './use-cases/get-post.use-case';
import { ListPostsUseCase } from './use-cases/list-posts.use-case';

const mediaProvider = mediaConfig.asProvider();

@Module({
  imports: [
    IteratorModule,
    MediaModule,
    PostFileUploadModule,
    PostFilesTusModule,
    ModeratedPostCleanupModule,
    PostEventsModule,
    ...mediaProvider.imports,
  ],
  providers: [
    PostFileResolver,
    PostsResolver,
    ListPostsUseCase,
    CreatePostUseCase,
    GetPostUseCase,
    DeletePostUseCase,
  ],
})
export class PostsModule {}
