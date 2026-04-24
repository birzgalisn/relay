import { useQuery } from '@tanstack/react-query';

import { getApiBaseUrl } from '../../../shared/util/get-api-base-url';
import { fetchLinks } from '../data-access/fetch-links';
import { LINKS_QUERY_KEY } from './constants';

export function useLandingLinks() {
  const linksQuery = useQuery({
    queryKey: LINKS_QUERY_KEY,
    queryFn: fetchLinks,
  });

  const links = linksQuery.data ?? [];

  return {
    linksQuery,
    links,
    apiBase: getApiBaseUrl(),
    isPending: linksQuery.isPending,
    isError: linksQuery.isError,
    error: linksQuery.error,
    hasLinks: links.length > 0,
  };
}
