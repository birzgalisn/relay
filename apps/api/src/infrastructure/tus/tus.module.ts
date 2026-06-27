import { DynamicModule, Module, type Provider } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { TusHook } from './hooks/tus.hook';
import type { TusRegisterAsyncOptions } from './interfaces/tus-register-async-options.interface';
import type { TusOptions } from './interfaces/tus.interface';
import { TUS_OPTIONS } from './tokens/tus.tokens';

@Module({})
export class TusModule {
  static register(options: TusOptions): DynamicModule {
    return {
      module: TusModule,
      providers: [{ provide: TUS_OPTIONS, useValue: options }, TusModule.tusHookProvider()],
      exports: [TusHook],
    };
  }

  static registerAsync<TArgs extends readonly unknown[]>(
    asyncOptions: TusRegisterAsyncOptions<TArgs>,
  ): DynamicModule {
    return {
      module: TusModule,
      imports: asyncOptions.imports ?? [],
      providers: [
        ...(asyncOptions.providers ?? []),
        {
          provide: TUS_OPTIONS,
          inject: asyncOptions.inject ? [...asyncOptions.inject] : [],
          useFactory: asyncOptions.useFactory,
        },
        TusModule.tusHookProvider(),
      ],
      exports: [TusHook],
    };
  }

  private static tusHookProvider(): Provider {
    return {
      provide: TusHook,
      useFactory: (opts: TusOptions, httpAdapterHost: HttpAdapterHost) =>
        new TusHook(httpAdapterHost, opts),
      inject: [TUS_OPTIONS, HttpAdapterHost],
    };
  }
}
