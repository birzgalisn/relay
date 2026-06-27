import type { RegisterAsyncOptions } from '../../../shared/interfaces/register-async-options.interface';
import type { StaticFilesOptions } from './static-files.interface';

export type StaticFilesRegisterAsyncOptions<Args extends readonly unknown[] = readonly unknown[]> =
  RegisterAsyncOptions<Args, StaticFilesOptions>;
