import type { PredictionType } from 'nsfwjs';

/** MobileNetV2 input size expected by nsfwjs. */
export const NSFW_INPUT_SIZE = 224;

export const BLOCKED_NSFW_CLASSES: PredictionType['className'][] = ['Porn', 'Hentai'];
