import type { DynamicModule, InjectionToken, Provider } from '@nestjs/common';

import type { TusOptions } from './tus.interface';

export interface TusRegisterAsyncOptions<Args extends readonly unknown[] = readonly unknown[]> {
  imports?: DynamicModule['imports'];
  inject?: InjectionToken[];
  providers?: Provider[];
  useFactory: (...args: Args) => TusOptions | Promise<TusOptions>;
}
