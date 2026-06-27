import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService, postFiles, posts } from '@repo/drizzle';
import { eq } from 'drizzle-orm';

import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';
import { TusArtifactsService } from '../../infrastructure/tus/tus-artifacts.service';
import { PostEventsPubSubService } from '../post-events-pubsub.service';

@Injectable()
export class DeletePostUseCase implements UseCase<string> {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly tusArtifacts: TusArtifactsService,
    private readonly postEventsPubSub: PostEventsPubSubService,
  ) {}

  async execute(id: string): Promise<void> {
    const tusIds = await this.drizzle.db.transaction(async (tx) => {
      const fileRows = await tx
        .select({ tusUploadId: postFiles.tusUploadId })
        .from(postFiles)
        .where(eq(postFiles.postId, id));

      const deleted = await tx.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });

      if (deleted.length === 0) {
        throw new NotFoundException(`Post ${id} not found`);
      }

      return fileRows
        .map((row) => row.tusUploadId)
        .filter((tid): tid is string => tid != null && tid.length > 0);
    });

    await Promise.all(tusIds.map((tusUploadId) => this.tusArtifacts.remove(tusUploadId)));
    await this.postEventsPubSub.publishRemoved(id);
  }
}
