import type { ServerOptions } from '@tus/server';

/** Same callback shape as `ServerOptions['onUploadFinish']` from `@tus/server` */
type TusOnUpload = NonNullable<ServerOptions['onUploadFinish']>;

type TusOnUploadArgs = Parameters<TusOnUpload>;

export type TusUploadRequest = TusOnUploadArgs[0];
export type TusUpload = TusOnUploadArgs[1];

export type TusUploadResult = {
  /** When true, this handler owned the upload; later handlers are skipped */
  handled: boolean;
};

export interface TusUploadHandler {
  onUpload(req: TusUploadRequest, upload: TusUpload): Promise<TusUploadResult>;
}
