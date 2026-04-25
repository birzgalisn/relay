import { Module } from '@nestjs/common';

import { UpController } from './up.controller';
import { UpResolver } from './up.resolver';
import { CheckDatabaseReachableUseCase } from './use-cases/check-database-reachable.use-case';

@Module({
  controllers: [UpController],
  providers: [UpResolver, CheckDatabaseReachableUseCase],
})
export class UpModule {}
