import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type * as tf from '@tensorflow/tfjs';

import { mobilenetV2Model } from './models/mobilenet-v2.model';

/** Relative to compiled `dist/infrastructure/nsfw/`. */
const WEIGHTS_DIR = path.join(__dirname, '..', '..', '..', 'assets', 'nsfw-models', 'mobilenet_v2');

export async function createNsfwModelIoHandler(tfns: typeof tf): Promise<tf.io.IOHandler> {
  const shardBuffers: Buffer[] = [];

  for (const group of mobilenetV2Model.weightsManifest) {
    for (const shardPath of group.paths) {
      shardBuffers.push(await readFile(path.join(WEIGHTS_DIR, shardPath)));
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
