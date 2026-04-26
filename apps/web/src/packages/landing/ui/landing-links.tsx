import { Flex, Group, Loader, Text } from '@repo/ui';

import { isInstanceOfError } from '../../../shared/util/is-instance-of-error';
import { useLandingLinks } from '../util/use-landing-links';
import { LinkCard } from './link-card';

export function LandingLinks() {
  const { graphqlEndpoint, links, isPending, isError, error, hasLinks } = useLandingLinks();

  if (isPending) {
    return (
      <Group justify="center" gap="xs">
        <Loader size="sm" />
        <Text c="dimmed" size="sm">
          Loading links...
        </Text>
      </Group>
    );
  }

  if (isError) {
    return (
      <Text c="dimmed" size="sm" ta="center">
        Could not load links from {graphqlEndpoint}.{' '}
        {isInstanceOfError(error) ? error.message : 'Unable to load links.'}
      </Text>
    );
  }

  if (hasLinks) {
    return (
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap="md"
        align="center"
        justify="center"
        wrap="wrap"
      >
        {links.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}
      </Flex>
    );
  }

  return (
    <Text c="dimmed" size="sm" ta="center">
      No links available. Make sure the NestJS API is running ({graphqlEndpoint}).
    </Text>
  );
}
