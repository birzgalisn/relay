import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { mediaConfig } from '../../config/media.config';

@Injectable()
export class MediaService {
  constructor(@Inject(mediaConfig.KEY) private readonly media: ConfigType<typeof mediaConfig>) {}

  getUrl(tusUploadId: string): string {
    const segments = tusUploadId.split('/').map(encodeURIComponent).join('/');
    const path = `/media/${segments}`;
    return `${this.media.baseUrl}${path}`;
  }
}
