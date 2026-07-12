import { Injectable } from '@nestjs/common';
import type { Upload } from '@tus/server';

import { MediaStorageService } from '../../infrastructure/media/services/media-storage.service';
import { toTusError } from '../../infrastructure/tus/util/to-tus-error.util';
import { finishPostFileUploadInputSchema } from '../schemas/finish-post-file-upload.schema';
import { EnqueuePostFileImageValidationService } from '../services/enqueue-post-file-image-validation.service';
import { FinishPostFileUploadUseCase } from '../use-cases/finish-post-file-upload.use-case';
import { ResolvePostStatusUseCase } from '../use-cases/resolve-post-status.use-case';

@Injectable()
export class PostFilesTusHooks {
  constructor(
    private readonly mediaStorage: MediaStorageService,
    private readonly finishPostFileUpload: FinishPostFileUploadUseCase,
    private readonly enqueueImageValidation: EnqueuePostFileImageValidationService,
    private readonly resolvePostStatus: ResolvePostStatusUseCase,
  ) {}

  async onUploadCreate(_req: unknown, upload: Upload) {
    if (upload.size) {
      await this.mediaStorage.ensureSpaceFor(upload.size);
    }

    return {};
  }

  async onUploadFinish(_req: unknown, upload: Upload) {
    const { postId, sortOrder, mimeType } = upload.metadata ?? {};

    try {
      const input = finishPostFileUploadInputSchema.parse({
        tusUploadId: upload.id,
        byteSize: upload.size ?? null,
        postId,
        sortOrder,
        mimeType,
      });

      const claimed = await this.finishPostFileUpload.execute(input);

      if (claimed) {
        await this.enqueueImageValidation.enqueue({ postFileId: claimed.postFileId });
        await this.resolvePostStatus.execute(input.postId);
      }

      await this.mediaStorage.broadcastStorageCapacity();
    } catch (err) {
      toTusError(err);
    }

    return {};
  }
}
