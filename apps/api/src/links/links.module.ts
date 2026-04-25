import { Module } from '@nestjs/common';

import { LinksResolver } from './links.resolver';
import { CreateLinkUseCase } from './use-cases/create-link.use-case';
import { DeleteLinkUseCase } from './use-cases/delete-link.use-case';
import { GetLinkUseCase } from './use-cases/get-link.use-case';
import { ListLinksUseCase } from './use-cases/list-links.use-case';
import { UpdateLinkUseCase } from './use-cases/update-link.use-case';

@Module({
  providers: [
    LinksResolver,
    CreateLinkUseCase,
    ListLinksUseCase,
    GetLinkUseCase,
    UpdateLinkUseCase,
    DeleteLinkUseCase,
  ],
})
export class LinksModule {}
