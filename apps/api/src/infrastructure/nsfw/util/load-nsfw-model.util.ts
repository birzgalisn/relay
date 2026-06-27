import { load } from 'nsfwjs/core';
import { MobileNetV2Model } from 'nsfwjs/models/mobilenet_v2';

import { NSFW_INPUT_SIZE } from '../constants/nsfw.constants';
import type { NsfwModel } from '../interfaces/nsfw-model.interface';

export async function loadNsfwModel(): Promise<NsfwModel> {
  return load('MobileNetV2', {
    size: NSFW_INPUT_SIZE,
    modelDefinitions: [MobileNetV2Model],
  });
}
