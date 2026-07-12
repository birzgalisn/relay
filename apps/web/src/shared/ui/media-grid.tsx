import { Box, Button, CloseButton, Image, Progress, SimpleGrid, Text } from '@mantine/core';
import { useState } from 'react';

export type MediaGridItem = {
  key: string;
  src: string;
  srcSet?: string;
  sizes?: string;
  alt?: string;
  /** When set with an empty `src`, replaces the generic empty placeholder (e.g. uploading). */
  emptyLabel?: string;
  /** 0–100: thin progress bar along the top edge of the tile (e.g. Tus upload). */
  uploadProgress?: number;
  /** Blur until the user taps Show once (e.g. NSFW check on the feed). Not used during create/upload. */
  blurWhileProcessing?: boolean;
};

type MediaGridProps = {
  items: MediaGridItem[];
  /** Disables remove controls (e.g. while publishing). */
  busy?: boolean;
  onRemove?: (index: number) => void;
  /** Full-bleed under a card header; outer radius removed (parent should clip). */
  flush?: boolean;
};

function gridSizes(count: number): string {
  if (count <= 1) {
    return '100vw';
  }
  if (count === 2) {
    return '50vw';
  }
  return '33vw';
}

function gridCols(count: number): number {
  if (count <= 1) {
    return 1;
  }
  if (count === 2) {
    return 2;
  }
  return 3;
}

type MediaGridTileProps = {
  item: MediaGridItem;
  busy: boolean;
  onRemove?: (index: number) => void;
  index: number;
};

function MediaGridTile({ item, busy, onRemove, index }: MediaGridTileProps) {
  const processing = item.blurWhileProcessing === true;
  const [revealed, setRevealed] = useState(false);
  const blurred = Boolean(item.src) && processing && !revealed;

  return (
    <Box
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
          srcSet={item.srcSet}
          sizes={item.sizes}
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
            filter: blurred ? 'blur(16px)' : undefined,
            transform: blurred ? 'scale(1.08)' : undefined,
            transition: 'filter 150ms ease',
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
        <Box pos="absolute" top={0} left={0} right={0} style={{ pointerEvents: 'none', zIndex: 2 }}>
          <Progress
            value={item.uploadProgress}
            size={5}
            radius={0}
            striped={item.uploadProgress < 5}
            animated={item.uploadProgress < 5}
          />
        </Box>
      ) : null}
      {item.src && processing && !revealed ? (
        <Button
          aria-label="Show image"
          title="Show"
          size="compact-xs"
          radius="xl"
          variant="filled"
          color="dark"
          pos="absolute"
          top="50%"
          left="50%"
          style={{
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            boxShadow: 'var(--mantine-shadow-sm)',
            opacity: 0.9,
          }}
          onClick={() => setRevealed(true)}
        >
          Show
        </Button>
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
  );
}

/**
 * Square tiles, tight gutter — e.g. multi-image previews in a feed column.
 */
export function MediaGrid({ items, busy = false, onRemove, flush = false }: MediaGridProps) {
  if (items.length === 0) {
    return null;
  }

  const cols = gridCols(items.length);
  const sizes = gridSizes(items.length);
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
          <MediaGridTile
            key={item.key}
            item={{ ...item, sizes: item.sizes ?? sizes }}
            busy={busy}
            onRemove={onRemove}
            index={index}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
