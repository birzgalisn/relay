import type { RegisterAsyncOptions } from '../../../shared/interfaces/register-async-options.interface';
import type { TusOptions } from './tus.interface';

export type TusRegisterAsyncOptions<Args extends readonly unknown[] = readonly unknown[]> =
  RegisterAsyncOptions<Args, TusOptions>;
