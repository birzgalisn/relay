import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { FileStore } from '@tus/file-store';
import { Server } from '@tus/server';
import type { FastifyInstance } from 'fastify';

import type { TusOptions } from './interfaces/tus.interface';
import { TUS_OPTIONS } from './tus.tokens';

@Injectable()
export class TusHook implements OnModuleInit {
  private readonly logger = new Logger(TusHook.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(TUS_OPTIONS)
    private readonly options: TusOptions,
  ) {}

  async onModuleInit() {
    const adapter = this.httpAdapterHost.httpAdapter;

    if (!(adapter instanceof FastifyAdapter)) {
      this.logger.warn(`Tus ${this.options.path} is only registered for Fastify`);
      return;
    }

    const server = new Server({
      path: this.options.path,
      datastore: new FileStore({ directory: this.options.root }),
      maxSize: this.options.maxUploadBytes,
      /**
       * Relative `Location` so the browser follows the same public host it used for `POST`
       * (avoids broken uploads when the API would otherwise emit an internal host behind Traefik/Docker).
       */
      relativeLocation: true,
      /**
       * Use `Forwarded` / `X-Forwarded-*` when building absolute URLs where the server still emits them.
       */
      respectForwardedHeaders: true,
      onUploadCreate: async (req, upload) => {
        const result = await this.options.onUploadCreate?.(req, upload);
        return result ?? {};
      },
      onUploadFinish: async (req, upload) => {
        const result = await this.options.onUploadFinish?.(req, upload);
        return result ?? {};
      },
    });

    const fastify = adapter.getInstance<FastifyInstance>();
    const wildcard = `${this.options.path}/*`;

    fastify.addContentTypeParser('application/offset+octet-stream', (_request, _payload, done) =>
      done(null),
    );

    fastify.route({
      method: ['GET', 'POST', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS'],
      url: this.options.path,
      handler: (request, reply) => {
        reply.hijack();
        void server.handle(request.raw, reply.raw);
      },
    });

    fastify.route({
      method: ['GET', 'POST', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS'],
      url: wildcard,
      handler: (request, reply) => {
        reply.hijack();
        void server.handle(request.raw, reply.raw);
      },
    });

    this.logger.log(
      `Handling file uploads at ${this.options.path} (storage: ${this.options.root})`,
    );
  }
}
