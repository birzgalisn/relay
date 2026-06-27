import type * as tf from '@tensorflow/tfjs';

export type ImageFileToTensor3dInput = {
  tf: typeof import('@tensorflow/tfjs');
  filePath: string;
};

export type ImageFileToTensor3dResult = tf.Tensor3D;
