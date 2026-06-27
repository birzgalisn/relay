import { DynamicModule, Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { FastifyStaticHook } from './hooks/fastify-static.hook';
import type { StaticFilesRegisterAsyncOptions } from './interfaces/static-files-register-async-options.interface';
import type { StaticFilesOptions } from './interfaces/static-files.interface';
import { STATIC_FILES_OPTIONS } from './tokens/static-files.tokens';

@Module({})
export class StaticFilesModule {
  static registerAsync<TArgs extends readonly unknown[]>(
    asyncOptions: StaticFilesRegisterAsyncOptions<TArgs>,
  ): DynamicModule {
    return {
      module: StaticFilesModule,
      imports: asyncOptions.imports ?? [],
      providers: [
        ...(asyncOptions.providers ?? []),
        {
          provide: STATIC_FILES_OPTIONS,
          inject: asyncOptions.inject ? [...asyncOptions.inject] : [],
          useFactory: asyncOptions.useFactory,
        },
        {
          provide: FastifyStaticHook,
          useFactory: (opts: StaticFilesOptions, httpAdapterHost: HttpAdapterHost) =>
            new FastifyStaticHook(httpAdapterHost, opts),
          inject: [STATIC_FILES_OPTIONS, HttpAdapterHost],
        },
      ],
    };
  }
}
