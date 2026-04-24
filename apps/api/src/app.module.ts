import { Module } from '@nestjs/common';
import { PrismaModule } from '@repo/prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinksModule } from './links/links.module';
import { UpModule } from './up/up.module';

@Module({
  imports: [PrismaModule, LinksModule, UpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
