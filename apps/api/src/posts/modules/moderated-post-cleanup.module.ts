import { Module } from '@nestjs/common';

import { MediaModule } from '../../infrastructure/media/media.module';
import { TusArtifactsModule } from '../../infrastructure/tus-artifacts/tus-artifacts.module';
import { CleanupModeratedPostsProcessor } from '../processors/cleanup-moderated-posts.processor';
import { ScheduleModeratedPostCleanupService } from '../services/schedule-moderated-post-cleanup.service';
import { CleanupModeratedPostsUseCase } from '../use-cases/cleanup-moderated-posts.use-case';
import { DeletePostUseCase } from '../use-cases/delete-post.use-case';

@Module({
  imports: [TusArtifactsModule, MediaModule],
  providers: [
    DeletePostUseCase,
    CleanupModeratedPostsUseCase,
    CleanupModeratedPostsProcessor,
    ScheduleModeratedPostCleanupService,
  ],
})
export class ModeratedPostCleanupModule {}
