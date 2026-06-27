import type { PredictionType } from 'nsfwjs';

export type EvaluateImageSafetyInput = {
  predictions: PredictionType[];
  blockThreshold: number;
};
