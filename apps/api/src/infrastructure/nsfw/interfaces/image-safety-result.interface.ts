import type { PredictionType } from 'nsfwjs';

export type ImageSafetyResult = {
  safe: boolean;
  predictions: PredictionType[];
};
