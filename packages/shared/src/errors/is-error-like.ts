export function isErrorLike(error: unknown): error is { message: string } {
  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? Reflect.get(error, 'message')
      : undefined;

  return typeof message === 'string' && message.length > 0;
}
