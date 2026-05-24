import { Injectable } from '@nestjs/common';

import { CursorService } from '../cursor/cursor.service';
import type { CursorTable } from '../cursor/interfaces/cursor-table.interface';
import type { PaginatedIteratorOptions } from './interfaces/paginated-iterator-options.interface';
import { PaginatedIterator } from './paginated.iterator';

@Injectable()
export class PaginatedIteratorFactory {
  constructor(private readonly cursorService: CursorService) {}

  create<T extends CursorTable>(options: PaginatedIteratorOptions<T>): PaginatedIterator<T> {
    return new PaginatedIterator(this.cursorService, options);
  }
}
