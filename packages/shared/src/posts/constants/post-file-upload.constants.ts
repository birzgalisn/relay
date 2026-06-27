import { BYTES_PER_MIB } from '../../file/constants/file-size.constants';

/** Per-file limit for post attachments (enforced by tus server `maxSize`). */
export const POST_FILE_MAX_UPLOAD_MIB = 20;

export const POST_FILE_MAX_UPLOAD_BYTES = POST_FILE_MAX_UPLOAD_MIB * BYTES_PER_MIB;
