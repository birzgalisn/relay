import { registerEnumType } from '@nestjs/graphql';
import { MediaMimeType } from '@repo/drizzle';

registerEnumType(MediaMimeType, {
  name: 'MediaMimeType',
});

export { MediaMimeType };
