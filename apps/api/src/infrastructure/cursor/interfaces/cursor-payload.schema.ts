import { z } from 'zod';

export const cursorPayloadSchema = z.object({
  createdAt: z.iso.datetime(),
  id: z.uuid(),
});

export type CursorPayload = z.infer<typeof cursorPayloadSchema>;
