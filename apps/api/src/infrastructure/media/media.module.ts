import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { mediaConfig } from '../config/media.config';
import { StaticFilesModule } from '../static-files/static-files.module';
import { TusHandlersModule } from '../tus/tus-handlers.module';
import { TusModule } from '../tus/tus.module';
import { MediaCoreModule } from './media-core.module';

const mediaProvider = mediaConfig.asProvider();

@Module({
  imports: [
    MediaCoreModule,
    TusHandlersModule,
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
    TusModule.registerAsync({
      imports: [TusHandlersModule, ...mediaProvider.imports],
      inject: mediaProvider.inject,
      useFactory(media: ConfigType<typeof mediaConfig>) {
        return {
          root: media.root,
          path: media.tusPath,
          maxUploadBytes: media.maxUploadBytes,
        };
      },
    }),
  ],
  exports: [MediaCoreModule],
})
export class MediaModule {}
