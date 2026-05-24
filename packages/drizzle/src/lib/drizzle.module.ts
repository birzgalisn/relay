import { Global, Module } from '@nestjs/common';

import { drizzleEnvConfig } from './config/drizzle-env.config';
import { DrizzleService } from './drizzle.service';

const drizzleEnvFromConfig = drizzleEnvConfig.asProvider();

@Global()
@Module({
  imports: [...drizzleEnvFromConfig.imports],
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
