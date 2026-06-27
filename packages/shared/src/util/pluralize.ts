/** Returns `singular` when count is 1; otherwise `plural` or `${singular}s`. */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
