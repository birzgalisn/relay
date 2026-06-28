import {
  BYTES_PER_GIB,
  BYTES_PER_MIB,
  STORAGE_RESERVE_BYTES,
} from '../constants/file-size.constants';

export function getUploadableFreeBytes(availableBytes: number): number {
  return Math.max(0, availableBytes - STORAGE_RESERVE_BYTES);
}

/** Used share of the full disk (feed view). */
export function getDiskBarUsedPct(totalBytes: number, usedBytes: number): number {
  if (totalBytes <= 0) {
    return 0;
  }

  return Math.min(100, (usedBytes / totalBytes) * 100);
}

/** Selected share of the full disk (create-post preview). */
export function getDiskBarPendingPct(totalBytes: number, pendingBytes: number): number {
  if (pendingBytes <= 0 || totalBytes <= 0) {
    return 0;
  }

  return Math.min(100, (pendingBytes / totalBytes) * 100);
}

function formatGib(bytes: number): string {
  const gib = bytes / BYTES_PER_GIB;
  if (gib >= 10) {
    return `${Math.round(gib)} GB`;
  }

  return `${gib.toFixed(1)} GB`;
}

function formatMib(bytes: number): string {
  const mib = bytes / BYTES_PER_MIB;
  if (mib >= 100) {
    return `${Math.round(mib)} MB`;
  }

  return `${mib.toFixed(1)} MB`;
}

/** Hover detail — one practical MiB figure, or selected + free after when previewing. */
export function formatStorageTooltipDetail(freeBytes: number, pendingBytes = 0): string {
  if (pendingBytes > 0) {
    return [
      `${formatMib(pendingBytes)} selected`,
      `${formatMib(Math.max(0, freeBytes - pendingBytes))} free after`,
    ].join('\n');
  }

  return `${formatMib(freeBytes)} free`;
}

/** Primary label — always visible, one sentence. */
export function formatStorageCaption(
  freeBytes: number,
  totalBytes: number,
  pendingBytes = 0,
): string {
  if (pendingBytes > 0) {
    const afterBytes = Math.max(0, freeBytes - pendingBytes);
    return `${formatGib(afterBytes)} free after upload`;
  }

  return `${formatGib(freeBytes)} free of ${formatGib(totalBytes)}`;
}

/** Visible only when uploads are blocked. */
export function formatStorageWarning(exceedsFree: boolean, uploadsBlocked: boolean): string | null {
  if (exceedsFree) {
    return 'Not enough storage';
  }

  if (uploadsBlocked) {
    return 'Storage full';
  }

  return null;
}
