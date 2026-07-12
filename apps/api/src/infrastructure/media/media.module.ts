import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { mediaConfig } from '../config/media.config';
import { StaticFilesModule } from '../static-files/static-files.module';
import { MediaResolver } from './media.resolver';
import { MediaStoragePubSubService } from './services/media-storage-pubsub.service';
import { MediaStorageService } from './services/media-storage.service';
import { MediaService } from './services/media.service';

const mediaProvider = mediaConfig.asProvider();

@Module({
  imports: [
    ...mediaProvider.imports,
    StaticFilesModule.registerAsync({
      imports: mediaProvider.imports,
      inject: mediaProvider.inject,
      useFactory(media: ConfigType<typeof mediaConfig>) {
        return {
          root: media.root,
          prefix: '/media/',
        };
      },
    }),
  ],
  providers: [MediaService, MediaStoragePubSubService, MediaStorageService, MediaResolver],
  exports: [MediaService, MediaStorageService],
})
export class MediaModule {}
