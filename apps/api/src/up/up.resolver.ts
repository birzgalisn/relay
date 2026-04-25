import { Query, Resolver } from '@nestjs/graphql';

import { UpStatus } from './enums/up-status.enum';
import { CheckDatabaseReachableUseCase } from './use-cases/check-database-reachable.use-case';

@Resolver()
export class UpResolver {
  constructor(private readonly checkDatabaseReachable: CheckDatabaseReachableUseCase) {}

  @Query(() => UpStatus)
  up(): Promise<UpStatus> {
    return this.checkDatabaseReachable.execute();
  }
}
