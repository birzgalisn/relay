import { Link } from '@repo/api';

import { getApiBaseUrl } from '../../../shared/util/get-api-base-url';

export async function fetchLinks(): Promise<Link[]> {
  const res = await fetch(`${getApiBaseUrl()}/links`);

  if (!res.ok) {
    throw new Error('Unable to fetch links');
  }

  return res.json();
}
