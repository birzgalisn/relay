import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import type { CreateLinkDto, UpdateLinkDto } from '@repo/api';

import { CreateLinkUseCase } from './use-cases/create-link.use-case';
import { DeleteLinkUseCase } from './use-cases/delete-link.use-case';
import { GetLinkUseCase } from './use-cases/get-link.use-case';
import { ListLinksUseCase } from './use-cases/list-links.use-case';
import { UpdateLinkUseCase } from './use-cases/update-link.use-case';

@Controller('links')
export class LinksController {
  constructor(
    private readonly createLink: CreateLinkUseCase,
    private readonly listLinks: ListLinksUseCase,
    private readonly getLink: GetLinkUseCase,
    private readonly updateLink: UpdateLinkUseCase,
    private readonly deleteLink: DeleteLinkUseCase,
  ) {}

  @Post()
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.createLink.execute(createLinkDto);
  }

  @Get()
  findAll() {
    return this.listLinks.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getLink.execute(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.updateLink.execute(id, updateLinkDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteLink.execute(id);
  }
}
