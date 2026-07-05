import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/shared';
import { and, eq, lt, or, type SQL } from 'drizzle-orm';

import { cursorPayloadSchema, type CursorPayload } from '../interfaces/cursor-payload.schema';
import type { CursorTableColumns } from '../interfaces/cursor-table.interface';

@Injectable()
export class CursorService {
  before(table: CursorTableColumns, cursor: CursorPayload | null): SQL | undefined {
    if (cursor == null) {
      return undefined;
    }

    const createdAt = new Date(cursor.createdAt);

    return or(
      lt(table.createdAt, createdAt),
      and(eq(table.createdAt, createdAt), lt(table.id, cursor.id)),
    );
  }

  encode(cursor: CursorPayload): string {
    return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
  }

  decode(encoded: string | null | undefined): CursorPayload | null {
    if (!encoded) {
      return null;
    }

    try {
      const json = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
      return cursorPayloadSchema.parse(json);
    } catch {
      throw AppError.badRequest('Invalid cursor');
    }
  }
}
