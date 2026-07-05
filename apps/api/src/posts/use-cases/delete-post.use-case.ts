import { Injectable } from '@nestjs/common';
import { DrizzleService, postFiles, posts } from '@repo/drizzle';
import { AppError } from '@repo/shared';
import { eq } from 'drizzle-orm';

import { MediaStorageService } from '../../infrastructure/media/services/media-storage.service';
import { MediaService } from '../../infrastructure/media/services/media.service';
import type { UseCase } from '../../shared/interfaces/use-case.interface';
import { PostEventsService } from '../services/post-events.service';

@Injectable()
export class DeletePostUseCase implements UseCase<string> {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly media: MediaService,
    private readonly postEvents: PostEventsService,
    private readonly mediaStorage: MediaStorageService,
  ) {}

  async execute(id: string): Promise<void> {
    const files = await this.delete(id);

    await Promise.all(files.map((file) => this.media.remove(file.storageKey)));
    await this.postEvents.broadcastRemoved(id);
    await this.mediaStorage.broadcastStorageCapacity();
  }

  private async delete(id: string): Promise<{ storageKey: string | null }[]> {
    return this.drizzle.db.transaction(async (tx) => {
      const fileRows = await tx
        .select({
          storageKey: postFiles.storageKey,
        })
        .from(postFiles)
        .where(eq(postFiles.postId, id));

      const deleted = await tx.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });

      if (deleted.length === 0) {
        throw AppError.notFound(`Post ${id} not found`, { postId: id });
      }

      return fileRows;
    });
  }
}
