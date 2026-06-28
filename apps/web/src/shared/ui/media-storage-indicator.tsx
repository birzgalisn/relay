import { Progress, Stack, Text, Tooltip } from '@mantine/core';
import {
  formatStorageCaption,
  formatStorageTooltipDetail,
  formatStorageWarning,
  getDiskBarPendingPct,
  getDiskBarUsedPct,
  getUploadableFreeBytes,
} from '@repo/shared';

import { useMediaStorage } from '../hooks/use-media-storage';

type MediaStorageIndicatorProps = {
  /** Bytes from files picked but not uploaded yet (create-post preview). */
  pendingBytes?: number;
};

export function MediaStorageIndicator({ pendingBytes = 0 }: MediaStorageIndicatorProps) {
  const { storage, loading, error } = useMediaStorage();

  if (loading || error || !storage) {
    return null;
  }

  const { totalBytes, usedBytes, availableBytes, uploadAllowed } = storage;
  const freeBytes = getUploadableFreeBytes(availableBytes);
  const exceedsFree = pendingBytes > freeBytes;
  const warning = formatStorageWarning(exceedsFree, !uploadAllowed);
  const previewingUpload = pendingBytes > 0;

  const body = (
    <>
      <Text size="xs" c="dimmed">
        {formatStorageCaption(freeBytes, totalBytes, pendingBytes)}
      </Text>
      <Progress.Root size="sm">
        <Progress.Section value={getDiskBarUsedPct(totalBytes, usedBytes)} color="blue" />
        {previewingUpload ? (
          <Progress.Section
            value={getDiskBarPendingPct(totalBytes, pendingBytes)}
            color={exceedsFree ? 'red' : 'orange'}
          />
        ) : null}
      </Progress.Root>
    </>
  );

  return (
    <Stack gap={4}>
      {warning ? (
        <Text size="xs" c="orange">
          {warning}
        </Text>
      ) : null}
      <Tooltip
        label={formatStorageTooltipDetail(freeBytes, pendingBytes)}
        withArrow
        multiline
        styles={{ tooltip: { whiteSpace: 'pre-line' } }}
      >
        <Stack gap={4} style={{ cursor: 'default' }}>
          {body}
        </Stack>
      </Tooltip>
    </Stack>
  );
}
