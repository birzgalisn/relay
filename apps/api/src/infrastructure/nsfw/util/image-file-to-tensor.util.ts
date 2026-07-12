import { AppError } from '@repo/shared';
import sharp from 'sharp';

import { NSFW_INPUT_SIZE } from '../constants/nsfw.constants';
import type {
  ImageFileToTensor3dInput,
  ImageFileToTensor3dResult,
} from '../interfaces/image-file-to-tensor3d.input';

export async function imageFileToTensor3d({
  tf,
  filePath,
}: ImageFileToTensor3dInput): Promise<ImageFileToTensor3dResult> {
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
      const channel = data[i * numChannels + c];
      if (channel === undefined) {
        throw AppError.internal('Image buffer ended before all pixels were read');
      }
      values[i * numChannels + c] = channel;
    }
  }

  return tf.tensor3d(values, [NSFW_INPUT_SIZE, NSFW_INPUT_SIZE, numChannels], 'int32');
}
