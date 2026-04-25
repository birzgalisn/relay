import { useQuery } from '@apollo/client/react';

import { getGraphqlHttpUrl } from '../../../shared/util/get-graphql-http-url';
import { LandingLinksDocument } from '../data-access/landing-links.generated';

export function useLandingLinks() {
  const linksQuery = useQuery(LandingLinksDocument);
  const links = linksQuery.data?.links ?? [];

  return {
    linksQuery,
    links,
    graphqlEndpoint: getGraphqlHttpUrl(),
    isPending: linksQuery.loading,
    isError: !!linksQuery.error,
    error: linksQuery.error,
    hasLinks: links.length > 0,
  };
}
