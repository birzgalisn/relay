import fastifyStatic from '@fastify/static';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { FastifyInstance } from 'fastify';

import type { StaticFilesOptions } from './interfaces/static-files.interface';

@Injectable()
export class FastifyStaticHook implements OnModuleInit {
  private readonly logger = new Logger(FastifyStaticHook.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly options: StaticFilesOptions,
  ) {}

  async onModuleInit() {
    const adapter = this.httpAdapterHost.httpAdapter;

    if (!(adapter instanceof FastifyAdapter)) {
      this.logger.warn(`Static ${this.options.prefix} is only registered for Fastify`);
      return;
    }

    const fastify = adapter.getInstance<FastifyInstance>();

    await fastify.register(fastifyStatic, {
      root: this.options.root,
      prefix: this.options.prefix,
    });

    this.logger.log(`Serving static files from ${this.options.root} at ${this.options.prefix}`);
  }
}
