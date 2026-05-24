import { Module } from '@nestjs/common';

import { mediaConfig } from '../config/media.config';
import { MediaService } from './media.service';

const mediaProvider = mediaConfig.asProvider();

@Module({
  imports: [...mediaProvider.imports],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaCoreModule {}
