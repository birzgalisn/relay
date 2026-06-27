/** Error shape read by `@tus/server` from hook callbacks (`status_code`, `body`). */
export class TusError extends Error {
  readonly body: string;

  constructor(
    readonly status_code: number,
    body: string,
  ) {
    super(body);
    this.body = body;
  }
}
