import type { CursorPayload } from '../../cursor/interfaces/cursor-payload.schema';
import type { CursorTable } from '../../cursor/interfaces/cursor-table.interface';
import type { CursorService } from '../../cursor/services/cursor.service';
import type { Iterator } from '../interfaces/iterator.interface';
import type { PaginatedIteratorOptions } from '../interfaces/paginated-iterator-options.interface';
import type { PaginatedPage } from '../interfaces/paginated-page.interface';

export class PaginatedIterator<T extends CursorTable> implements Iterator<T> {
  private static defaultGetCursor<T extends CursorTable>(item: T): CursorPayload {
    return {
      createdAt: item.createdAt.toISOString(),
      id: item.id,
    };
  }

  private readonly getCursor: (item: T) => CursorPayload;
  private cursor: CursorPayload | null;
  private exhausted = false;
  private pageHasMore = true;
  private fetchedOnce = false;
  private lastPageCursor: string | null = null;

  constructor(
    private readonly cursorService: CursorService,
    private readonly options: PaginatedIteratorOptions<T>,
  ) {
    this.getCursor = options.getCursor ?? PaginatedIterator.defaultGetCursor;
    this.cursor = this.cursorService.decode(options.initialCursor);
  }

  async hasNext(): Promise<boolean> {
    if (this.exhausted) {
      return false;
    }
    if (!this.fetchedOnce) {
      return true;
    }
    return this.pageHasMore;
  }

  async next(): Promise<T[]> {
    if (this.exhausted) {
      throw new Error('No more pages');
    }

    const { pageSize, table, fetchRows } = this.options;
    const limit = pageSize + 1;
    const where = this.cursorService.before(table, this.cursor);
    const rows = await fetchRows(where, limit);
    const hasMore = rows.length > pageSize;
    const nodes = hasMore ? rows.slice(0, pageSize) : rows;
    const lastNode = nodes.at(-1);
    const endCursor =
      hasMore && lastNode != null ? this.cursorService.encode(this.getCursor(lastNode)) : null;

    this.fetchedOnce = true;
    this.pageHasMore = hasMore;
    this.lastPageCursor = endCursor;

    if (!hasMore) {
      this.exhausted = true;
    } else if (endCursor != null) {
      this.cursor = this.cursorService.decode(endCursor);
    }

    return nodes;
  }

  getNextCursor(): string | null {
    return this.lastPageCursor;
  }

  async readPage(): Promise<PaginatedPage<T>> {
    if (!(await this.hasNext())) {
      return { nodes: [], nextCursor: null, hasNextPage: false };
    }

    const nodes = await this.next();
    const hasNextPage = await this.hasNext();

    return {
      nodes,
      nextCursor: hasNextPage ? this.getNextCursor() : null,
      hasNextPage,
    };
  }
}
