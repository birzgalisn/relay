import { Controller, Get } from '@nestjs/common';

import { CheckDatabaseReachableUseCase } from './use-cases/check-database-reachable.use-case';

@Controller('up')
export class UpController {
  constructor(private readonly checkDatabaseReachable: CheckDatabaseReachableUseCase) {}

  @Get()
  async getUp() {
    await Promise.all([this.checkDatabaseReachable.execute()]);

    return 'ok';
  }
}
