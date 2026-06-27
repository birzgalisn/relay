import { DynamicModule, Module, type Provider } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import type { TusRegisterAsyncOptions } from './interfaces/tus-register-async-options.interface';
import type { TusOptions } from './interfaces/tus.interface';
import { TusHook } from './tus.hook';
import { TUS_OPTIONS } from './tus.tokens';

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
