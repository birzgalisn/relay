import type { RegisterAsyncOptions } from '../../../shared/interfaces/register-async-options.interface';
import type { CorsOptions } from './cors.interface';

export type CorsRegisterAsyncOptions<Args extends readonly unknown[] = readonly unknown[]> =
  RegisterAsyncOptions<Args, CorsOptions>;
