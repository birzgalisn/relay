export interface StaticFilesOptions {
  /** Absolute path on disk (e.g. tus datastore) */
  root: string;
  /** URL prefix for Fastify static (e.g. `/media/`) */
  prefix: string;
}
