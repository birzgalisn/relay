import { Injectable } from '@nestjs/common';

import type { CursorTable } from '../../cursor/interfaces/cursor-table.interface';
import { CursorService } from '../../cursor/services/cursor.service';
import type { PaginatedIteratorOptions } from '../interfaces/paginated-iterator-options.interface';
import { PaginatedIterator } from '../util/paginated.iterator';

@Injectable()
export class PaginatedIteratorFactory {
  constructor(private readonly cursorService: CursorService) {}

  create<T extends CursorTable>(options: PaginatedIteratorOptions<T>): PaginatedIterator<T> {
    return new PaginatedIterator(this.cursorService, options);
  }
}
