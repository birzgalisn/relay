import { ServerOptions } from '@tus/server';

export interface TusOptions extends Pick<ServerOptions, 'onUploadCreate' | 'onUploadFinish'> {
  /** Absolute path on disk where tus stores files and metadata */
  root: string;
  /** URL base path for tus uploads (e.g. `/posts/files`) */
  path: string;
  /** Default 20 MiB */
  maxUploadBytes: number;
}
