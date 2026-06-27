import { BLOCKED_NSFW_CLASSES } from '../constants/nsfw.constants';
import type { EvaluateImageSafetyInput } from '../interfaces/evaluate-image-safety.input';

const blockedClasses = new Set(BLOCKED_NSFW_CLASSES);

export function evaluateImageSafety({
  predictions,
  blockThreshold,
}: EvaluateImageSafetyInput): boolean {
  return !predictions.some(
    (prediction) =>
      blockedClasses.has(prediction.className) && prediction.probability >= blockThreshold,
  );
}
