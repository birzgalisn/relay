import { createRequire } from 'node:module';
import path from 'node:path';

const moduleRequire = createRequire(__filename);

export async function initTfWasmBackend(): Promise<typeof import('@tensorflow/tfjs')> {
  const { setWasmPaths } = await import('@tensorflow/tfjs-backend-wasm');
  await import('@tensorflow/tfjs-backend-wasm');

  const wasmDir = path.join(
    path.dirname(moduleRequire.resolve('@tensorflow/tfjs-backend-wasm/package.json')),
    'dist',
  );
  setWasmPaths(`${wasmDir}${path.sep}`);

  const tf = await import('@tensorflow/tfjs');
  tf.enableProdMode();
  await tf.setBackend('wasm');
  await tf.ready();

  return tf;
}
