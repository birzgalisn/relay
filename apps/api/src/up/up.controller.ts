import { Controller, Get } from '@nestjs/common';

import { UpStatus } from './enums/up-status.enum';
import { RunUpChecksUseCase } from './use-cases/run-up-checks.use-case';

@Controller('up')
export class UpController {
  constructor(private readonly runUpChecks: RunUpChecksUseCase) {}

  @Get()
  getUp(): Promise<UpStatus> {
    return this.runUpChecks.execute();
  }
}
