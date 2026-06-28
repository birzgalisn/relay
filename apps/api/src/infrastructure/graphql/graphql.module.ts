import path from 'node:path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { PostsModule } from '../../posts/posts.module';
import { UpModule } from '../../up/up.module';
import { appConfig } from '../config/app.config';
import { NodeEnv } from '../config/interfaces/app-env.interface';
import { MediaModule } from '../media/media.module';

const appEnvFromConfig = appConfig.asProvider();

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: appEnvFromConfig.imports,
      inject: appEnvFromConfig.inject,
      useFactory(app: ConfigType<typeof appConfig>) {
        return {
          autoSchemaFile:
            app.nodeEnv === NodeEnv.DEVELOPMENT
              ? path.join(process.cwd(), 'src/_generated/schema.graphql')
              : true,
          sortSchema: true,
          playground: false,
          subscriptions: {
            'graphql-ws': true,
          },
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
        };
      },
    }),
    UpModule,
    MediaModule,
    PostsModule,
  ],
})
export class GraphqlModule {}
