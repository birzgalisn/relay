import { getApiBaseUrl } from './get-api-base-url';

/** Tus mount URL (no trailing slash). */
export function getTusEndpoint() {
  return `${getApiBaseUrl()}/files`;
}
