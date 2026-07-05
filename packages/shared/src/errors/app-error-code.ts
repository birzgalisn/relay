export enum AppErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  /** Malformed request/argument that is not tied to a user-facing input field. */
  BAD_REQUEST = 'BAD_REQUEST',
  /** Input validation failure. Always carries per-field detail (`fieldErrors`). */
  VALIDATION = 'VALIDATION',
  STORAGE_FULL = 'STORAGE_FULL',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  INTERNAL = 'INTERNAL',
}

export const APP_ERROR_HTTP_STATUS: Record<AppErrorCode, number> = {
  [AppErrorCode.NOT_FOUND]: 404,
  [AppErrorCode.CONFLICT]: 409,
  [AppErrorCode.BAD_REQUEST]: 400,
  [AppErrorCode.VALIDATION]: 400,
  [AppErrorCode.STORAGE_FULL]: 507,
  [AppErrorCode.SERVICE_UNAVAILABLE]: 503,
  [AppErrorCode.INTERNAL]: 500,
};
