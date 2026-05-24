import { Box, CloseButton, Image, Progress, SimpleGrid, Text } from '@mantine/core';

export type MediaGridItem = {
  key: string;
  src: string;
  alt?: string;
  /** When set with an empty `src`, replaces the generic empty placeholder (e.g. uploading). */
  emptyLabel?: string;
  /** 0–100: thin progress bar along the top edge of the tile (e.g. Tus upload). */
  uploadProgress?: number;
};

type MediaGridProps = {
  items: MediaGridItem[];
  /** Disables remove controls (e.g. while publishing). */
  busy?: boolean;
  onRemove?: (index: number) => void;
  /** Full-bleed under a card header; outer radius removed (parent should clip). */
  flush?: boolean;
};

function gridCols(count: number): number {
  if (count <= 1) {
    return 1;
  }
  if (count === 2) {
    return 2;
  }
  return 3;
}

/**
 * Square tiles, tight gutter — e.g. multi-image previews in a feed column.
 */
export function MediaGrid({ items, busy = false, onRemove, flush = false }: MediaGridProps) {
  if (items.length === 0) {
    return null;
  }

  const cols = gridCols(items.length);
  const gap = 2;

  return (
    <Box
      style={{
        borderRadius: flush ? 0 : 'var(--mantine-radius-md)',
        overflow: 'hidden',
      }}
    >
      <SimpleGrid cols={cols} spacing={gap}>
        {items.map((item, index) => (
          <Box
            key={item.key}
            pos="relative"
            style={{
              aspectRatio: '1',
              overflow: 'hidden',
              backgroundColor: 'var(--mantine-color-default-hover)',
            }}
          >
            {item.src ? (
              <Image
                src={item.src}
                alt={item.alt ?? ''}
                fit="cover"
                pos="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                loading="lazy"
                style={{
                  objectPosition: 'center',
                  zIndex: 0,
                }}
              />
            ) : (
              <Box
                display="flex"
                w="100%"
                h="100%"
                p="xs"
                style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <Text size="xs" c="dimmed" ta="center">
                  {item.emptyLabel ?? 'Preview not available'}
                </Text>
              </Box>
            )}
            {typeof item.uploadProgress === 'number' ? (
              <Box
                pos="absolute"
                top={0}
                left={0}
                right={0}
                style={{ pointerEvents: 'none', zIndex: 2 }}
              >
                <Progress
                  value={item.uploadProgress}
                  size={5}
                  radius={0}
                  striped={item.uploadProgress < 5}
                  animated={item.uploadProgress < 5}
                />
              </Box>
            ) : null}
            {onRemove && !busy ? (
              <CloseButton
                aria-label="Remove image"
                title="Remove"
                size="sm"
                radius="xl"
                pos="absolute"
                top={6}
                right={6}
                variant="filled"
                color="dark"
                opacity={0.75}
                style={{ boxShadow: 'var(--mantine-shadow-sm)', zIndex: 3 }}
                onClick={() => onRemove(index)}
              />
            ) : null}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
