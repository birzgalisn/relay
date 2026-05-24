export interface TusOptions {
  /** Absolute path on disk where tus stores files and metadata */
  root: string;
  /** URL base path for tus uploads (e.g. `/files`) */
  path: string;
  /** Default 20 MiB */
  maxUploadBytes: number;
}
