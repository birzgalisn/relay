import { type ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { type GqlContextType, GqlArgumentsHost } from '@nestjs/graphql';
import { AppErrorCode, isAppError } from '@repo/shared';

import { toGraphQLError } from './to-graphql-error';

/**
 * Single boundary that turns thrown errors into a consistent client contract.
 *
 * Domain code stays framework-agnostic (it throws {@link AppError}); this
 * filter is the only place that knows about GraphQL, so adding a new error kind
 * never requires touching resolvers. Non-GraphQL transports (e.g. the REST
 * health check) fall back to Nest's default handling.
 */
@Catch()
export class GraphqlExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(GraphqlExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType<GqlContextType>() !== 'graphql') {
      super.catch(exception, host);
      return;
    }

    const gqlError = toGraphQLError(exception);

    if (gqlError.extensions.code === AppErrorCode.INTERNAL && !isAppError(exception)) {
      const gqlHost = GqlArgumentsHost.create(host);
      this.logger.error(
        `Unhandled error in ${gqlHost.getInfo<{ fieldName?: string }>()?.fieldName ?? 'GraphQL'}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    throw gqlError;
  }
}
