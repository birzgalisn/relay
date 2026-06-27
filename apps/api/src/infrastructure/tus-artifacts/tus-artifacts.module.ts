import { Module } from '@nestjs/common';

import { mediaConfig } from '../config/media.config';
import { TusArtifactsService } from './services/tus-artifacts.service';

const mediaProvider = mediaConfig.asProvider();

@Module({
  imports: [...mediaProvider.imports],
  providers: [TusArtifactsService],
  exports: [TusArtifactsService],
})
export class TusArtifactsModule {}
