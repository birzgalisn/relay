import type { SQL } from 'drizzle-orm';

import type { CursorPayload } from '../../cursor/interfaces/cursor-payload.schema';
import type {
  CursorTable,
  CursorTableColumns,
} from '../../cursor/interfaces/cursor-table.interface';

export interface PaginatedIteratorOptions<T extends CursorTable> {
  pageSize: number;
  initialCursor?: string | null;
  table: CursorTableColumns;
  fetchRows: (where: SQL | undefined, limit: number) => Promise<T[]>;
  getCursor?: (item: T) => CursorPayload;
}
