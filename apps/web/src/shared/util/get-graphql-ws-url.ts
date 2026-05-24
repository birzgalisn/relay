import { getGraphqlHttpUrl } from './get-graphql-http-url';

export function getGraphqlWsUrl() {
  return getGraphqlHttpUrl()
    .replace(/^https:\/\//, 'wss://')
    .replace(/^http:\/\//, 'ws://');
}
