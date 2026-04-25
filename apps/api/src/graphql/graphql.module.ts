import path from 'node:path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { LinksModule } from '../links/links.module';
import { UpModule } from '../up/up.module';

const autoSchemaFile =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
    ? true
    : path.join(process.cwd(), 'src/_generated/schema.graphql');

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile,
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    LinksModule,
    UpModule,
  ],
})
export class GraphqlModule {}
