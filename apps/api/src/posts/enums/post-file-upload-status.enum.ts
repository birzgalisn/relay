import { registerEnumType } from '@nestjs/graphql';
import { PostFileUploadStatus } from '@repo/drizzle';

registerEnumType(PostFileUploadStatus, {
  name: 'PostFileUploadStatus',
});

export { PostFileUploadStatus };
