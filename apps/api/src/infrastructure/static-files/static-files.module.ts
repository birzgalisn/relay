import { DynamicModule, Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { FastifyStaticHook } from './fastify-static.hook';
import type { StaticFilesOptions } from './interfaces/static-files.interface';

export interface StaticFilesRegisterAsyncOptions {
  imports?: DynamicModule['imports'];
  inject?: any[];
  useFactory: (...args: any[]) => StaticFilesOptions | Promise<StaticFilesOptions>;
}

export const STATIC_FILES_OPTIONS = Symbol('STATIC_FILES_OPTIONS');

@Module({})
export class StaticFilesModule {
  static registerAsync(asyncOptions: StaticFilesRegisterAsyncOptions): DynamicModule {
    return {
      module: StaticFilesModule,
      imports: asyncOptions.imports ?? [],
      providers: [
        {
          provide: STATIC_FILES_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject ?? [],
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
