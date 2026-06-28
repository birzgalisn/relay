import { Injectable } from '@nestjs/common';

import type { UseCase } from '../../../shared/interfaces/use-case.interface';
import { MediaStorage } from '../models/media-storage.model';
import { MediaStorageService } from '../services/media-storage.service';

@Injectable()
export class GetMediaStorageUseCase implements UseCase<void, MediaStorage> {
  constructor(private readonly mediaStorage: MediaStorageService) {}

  execute(): Promise<MediaStorage> {
    return this.mediaStorage.getStatus();
  }
}
