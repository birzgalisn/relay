import { getApiBaseUrl } from '../../../shared/util/get-api-base-url';

/** Tus mount URL for post file uploads (no trailing slash). */
export function getPostFilesTusEndpoint() {
  return `${getApiBaseUrl()}/posts/files`;
}
