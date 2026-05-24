import type { SQLWrapper } from 'drizzle-orm';

export type CursorTable = {
  id: string;
  createdAt: Date;
};

export type CursorTableColumns = {
  [K in keyof CursorTable]: SQLWrapper;
};
