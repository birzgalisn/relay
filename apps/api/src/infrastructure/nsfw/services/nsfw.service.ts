import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { nsfwConfig } from '../../config/nsfw.config';
import type { ImageSafetyResult } from '../interfaces/image-safety-result.interface';
import type { NsfwModel } from '../interfaces/nsfw-model.interface';
import { evaluateImageSafety } from '../util/evaluate-image-safety.util';
import { imageFileToTensor3d } from '../util/image-file-to-tensor.util';
import { initTfWasmBackend } from '../util/init-tf-wasm-backend.util';
import { loadNsfwModel } from '../util/load-nsfw-model.util';

@Injectable()
export class NsfwService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NsfwService.name);
  private tf!: Awaited<ReturnType<typeof initTfWasmBackend>>;
  private model!: NsfwModel;

  constructor(@Inject(nsfwConfig.KEY) private readonly config: ConfigType<typeof nsfwConfig>) {}

  async onModuleInit(): Promise<void> {
    this.tf = await initTfWasmBackend();
    this.model = await loadNsfwModel();

    this.logger.log('NSFW model ready');
  }

  onModuleDestroy(): void {
    this.model?.dispose();
  }

  async isImageSafe(filePath: string): Promise<ImageSafetyResult> {
    const image = await imageFileToTensor3d({ tf: this.tf, filePath });

    try {
      const predictions = await this.model.classify(image);
      return {
        safe: evaluateImageSafety({
          predictions,
          blockThreshold: this.config.blockThreshold,
        }),
        predictions,
      };
    } finally {
      image.dispose();
    }
  }
}
