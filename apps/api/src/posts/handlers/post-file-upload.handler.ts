import { Injectable } from '@nestjs/common';

import type {
  TusUpload,
  TusUploadHandler,
  TusUploadRequest,
  TusUploadResult,
} from '../../infrastructure/tus/interfaces/tus-upload-handler.interface';
import { FinishPostFileUploadUseCase } from '../use-cases/finish-post-file-upload.use-case';

@Injectable()
export class PostFileUploadHandler implements TusUploadHandler {
  constructor(private readonly finishPostFileUpload: FinishPostFileUploadUseCase) {}

  onUpload(_req: TusUploadRequest, upload: TusUpload): Promise<TusUploadResult> {
    return this.finishPostFileUpload.execute(upload);
  }
}
