import { Module } from '@nestjs/common';

import { IteratorModule } from '../infrastructure/iterator/iterator.module';
import { MediaCoreModule } from '../infrastructure/media/media-core.module';
import { TusArtifactsModule } from '../infrastructure/tus/tus-artifacts.module';
import { PostFileUploadHandler } from './handlers/post-file-upload.handler';
import { PostFileResolver } from './models/post-file.model';
import { PostsResolver } from './posts.resolver';
import { CreatePostUseCase } from './use-cases/create-post.use-case';
import { DeletePostUseCase } from './use-cases/delete-post.use-case';
import { FinishPostFileUploadUseCase } from './use-cases/finish-post-file-upload.use-case';
import { GetPostUseCase } from './use-cases/get-post.use-case';
import { ListPostsUseCase } from './use-cases/list-posts.use-case';

@Module({
  imports: [IteratorModule, MediaCoreModule, TusArtifactsModule],
  providers: [
    PostFileResolver,
    PostsResolver,
    ListPostsUseCase,
    CreatePostUseCase,
    GetPostUseCase,
    DeletePostUseCase,
    FinishPostFileUploadUseCase,
    PostFileUploadHandler,
  ],
  exports: [PostFileUploadHandler, FinishPostFileUploadUseCase],
})
export class PostsModule {}
