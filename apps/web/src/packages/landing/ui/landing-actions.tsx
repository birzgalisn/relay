import { Button, Flex, Group, Image, Stack, useComputedColorScheme } from '@repo/ui';

const deployHref =
  'https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo';

export function LandingActions() {
  const colorScheme = useComputedColorScheme('light');

  return (
    <Stack gap="md" align="center" w="100%">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap="md"
        align="center"
        justify="center"
        wrap="wrap"
        w="100%"
      >
        <Button
          component="a"
          href={deployHref}
          target="_blank"
          rel="noopener noreferrer"
          color="dark"
          radius={9999}
          h={{ base: 40, sm: 48 }}
          px="lg"
          leftSection={
            <Image
              src="/vercel.svg"
              alt=""
              w={20}
              h={20}
              style={{ filter: colorScheme === 'dark' ? 'invert(1)' : undefined }}
            />
          }
        >
          Deploy now
        </Button>
        <Button
          component="a"
          variant="default"
          href="https://turborepo.dev/docs?utm_source"
          target="_blank"
          rel="noopener noreferrer"
          radius={9999}
          h={{ base: 40, sm: 48 }}
          miw={{ sm: 180 }}
          fz={{ base: 'sm', sm: 'md' }}
        >
          Read our docs
        </Button>
      </Flex>
      <Group justify="center" w="100%">
        <Button
          variant="default"
          radius={9999}
          h={{ base: 40, sm: 48 }}
          miw={{ sm: 180 }}
          fz={{ base: 'sm', sm: 'md' }}
          onClick={() => alert('Hello from web!')}
        >
          Open alert
        </Button>
      </Group>
    </Stack>
  );
}
