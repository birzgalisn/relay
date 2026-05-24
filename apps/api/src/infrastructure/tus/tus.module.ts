import { DynamicModule, Global, Module, type Provider } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import type { TusUploadHandler } from './interfaces/tus-upload-handler.interface';
import type { TusOptions } from './interfaces/tus.interface';
import { TusHook } from './tus.hook';
import { TUS_OPTIONS, TUS_UPLOAD_HANDLERS } from './tus.tokens';

@Global()
@Module({})
export class TusModule {
  static register(options: TusOptions): DynamicModule {
    return {
      module: TusModule,
      providers: [{ provide: TUS_OPTIONS, useValue: options }, TusModule.tusHookProvider()],
      exports: [TusHook],
    };
  }

  static registerAsync(options: {
    imports?: DynamicModule['imports'];
    inject?: any[];
    useFactory: (...args: any[]) => TusOptions | Promise<TusOptions>;
  }): DynamicModule {
    return {
      module: TusModule,
      imports: options.imports ?? [],
      providers: [
        {
          provide: TUS_OPTIONS,
          inject: options.inject ?? [],
          useFactory: options.useFactory,
        },
        TusModule.tusHookProvider(),
      ],
      exports: [TusHook],
    };
  }

  private static tusHookProvider(): Provider {
    return {
      provide: TusHook,
      useFactory: (
        opts: TusOptions,
        httpAdapterHost: HttpAdapterHost,
        handlers?: TusUploadHandler[],
      ) => new TusHook(httpAdapterHost, opts, handlers),
      inject: [TUS_OPTIONS, HttpAdapterHost, { token: TUS_UPLOAD_HANDLERS, optional: true }],
    };
  }
}
