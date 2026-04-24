import { Module } from '@nestjs/common';

import { UpController } from './up.controller';
import { CheckDatabaseReachableUseCase } from './use-cases/check-database-reachable.use-case';

@Module({
  controllers: [UpController],
  providers: [CheckDatabaseReachableUseCase],
})
export class UpModule {}
