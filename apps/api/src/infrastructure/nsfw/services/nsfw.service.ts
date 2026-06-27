import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type * as tf from '@tensorflow/tfjs';
import type { PredictionType } from 'nsfwjs';
import { load } from 'nsfwjs/core';
import sharp from 'sharp';

import { nsfwConfig } from '../../config/nsfw.config';
import { mobilenetV2Model } from '../models/mobilenet-v2.model';

const moduleRequire = createRequire(__filename);

const BLOCKED_NSFW_CLASSES = new Set<PredictionType['className']>(['Porn', 'Hentai']);

/** Must match nsfwjs MobileNetV2 input; resize in sharp to avoid full-resolution TF tensors. */
const NSFW_INPUT_SIZE = 224;

const MOBILENET_V2_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'assets',
  'nsfw-models',
  'mobilenet_v2',
);

type NsfwModel = {
  classify: (image: tf.Tensor3D) => Promise<PredictionType[]>;
  dispose: () => void;
};

@Injectable()
export class NsfwService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NsfwService.name);
  private tf!: typeof import('@tensorflow/tfjs');
  private model!: NsfwModel;

  constructor(@Inject(nsfwConfig.KEY) private readonly nsfw: ConfigType<typeof nsfwConfig>) {}

  async onModuleInit(): Promise<void> {
    sharp.cache(false);
    sharp.concurrency(1);

    this.tf = await this.initWasmBackend();
    const modelHandler = await this.createModelIoHandler(this.tf);
    // nsfwjs accepts `tf.io.IOHandler` at runtime; typings only list model names/URLs.
    this.model = await load(modelHandler as unknown as string);
    this.logger.log(`NSFWJS model loaded (${MOBILENET_V2_DIR})`);
  }

  onModuleDestroy(): void {
    this.model?.dispose();
  }

  async isImageSafe(filePath: string): Promise<{ safe: boolean; predictions: PredictionType[] }> {
    const predictions = await this.classifyFile(filePath);
    const safe = !predictions.some(
      (p) => BLOCKED_NSFW_CLASSES.has(p.className) && p.probability >= this.nsfw.blockThreshold,
    );
    return { safe, predictions };
  }

  private async classifyFile(filePath: string): Promise<PredictionType[]> {
    const image = await this.fileToTensor3d(filePath);

    try {
      return await this.model.classify(image);
    } finally {
      image.dispose();
    }
  }

  private async fileToTensor3d(filePath: string): Promise<tf.Tensor3D> {
    const { data } = await sharp(filePath)
      .rotate()
      .resize(NSFW_INPUT_SIZE, NSFW_INPUT_SIZE, { fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const numChannels = 3;
    const numPixels = NSFW_INPUT_SIZE * NSFW_INPUT_SIZE;
    const values = new Int32Array(numPixels * numChannels);

    for (let i = 0; i < numPixels; i++) {
      for (let c = 0; c < numChannels; c++) {
        values[i * numChannels + c] = data[i * numChannels + c]!;
      }
    }

    return this.tf.tensor3d(values, [NSFW_INPUT_SIZE, NSFW_INPUT_SIZE, numChannels], 'int32');
  }

  private async createModelIoHandler(tfns: typeof tf): Promise<tf.io.IOHandler> {
    const shardBuffers: Buffer[] = [];

    for (const group of mobilenetV2Model.weightsManifest) {
      for (const shardPath of group.paths) {
        shardBuffers.push(await readFile(path.join(MOBILENET_V2_DIR, shardPath)));
      }
    }

    const totalBytes = shardBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const weightData = new Uint8Array(totalBytes);
    let offset = 0;

    for (const buf of shardBuffers) {
      weightData.set(buf, offset);
      offset += buf.byteLength;
    }

    return tfns.io.fromMemory({
      modelTopology: mobilenetV2Model.modelTopology,
      weightSpecs: mobilenetV2Model.weightsManifest.flatMap((group) => group.weights),
      weightData: weightData.buffer,
    });
  }

  private async initWasmBackend(): Promise<typeof tf> {
    const { setWasmPaths } = await import('@tensorflow/tfjs-backend-wasm');
    await import('@tensorflow/tfjs-backend-wasm');

    const wasmDir = path.join(
      path.dirname(moduleRequire.resolve('@tensorflow/tfjs-backend-wasm/package.json')),
      'dist',
    );
    setWasmPaths(`${wasmDir}${path.sep}`);

    const tfns = await import('@tensorflow/tfjs');
    tfns.enableProdMode();
    await tfns.setBackend('wasm');
    await tfns.ready();
    this.logger.log('TensorFlow.js WASM backend ready');
    return tfns;
  }
}
