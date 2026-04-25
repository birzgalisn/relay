import { Module } from '@nestjs/common';
import { PrismaModule } from '@repo/prisma';

import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [PrismaModule, GraphqlModule],
})
export class AppModule {}
