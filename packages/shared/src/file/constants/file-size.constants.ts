export const BYTES_PER_MIB = 1024 * 1024;
export const BYTES_PER_GIB = 1024 * BYTES_PER_MIB;

/** Minimum free disk space kept on the media volume before uploads are rejected (5 GiB). */
export const STORAGE_RESERVE_MIB = 5120;

export const STORAGE_RESERVE_BYTES = STORAGE_RESERVE_MIB * BYTES_PER_MIB;
