import { Module } from '@nestjs/common';

import { UpController } from './up.controller';
import { UpResolver } from './up.resolver';
import { CheckDatabaseReachableUseCase } from './use-cases/check-database-reachable.use-case';
import { CheckRedisReachableUseCase } from './use-cases/check-redis-reachable.use-case';
import { RunUpChecksUseCase } from './use-cases/run-up-checks.use-case';

@Module({
  controllers: [UpController],
  providers: [
    UpResolver,
    RunUpChecksUseCase,
    CheckDatabaseReachableUseCase,
    CheckRedisReachableUseCase,
  ],
})
export class UpModule {}
