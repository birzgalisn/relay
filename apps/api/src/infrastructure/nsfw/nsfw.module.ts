import { Module } from '@nestjs/common';

import { nsfwConfig } from '../config/nsfw.config';
import { NsfwService } from './nsfw.service';

const nsfwFromConfig = nsfwConfig.asProvider();

@Module({
  imports: [...nsfwFromConfig.imports],
  providers: [NsfwService],
  exports: [NsfwService],
})
export class NsfwModule {}
