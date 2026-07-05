import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { type FieldError, parseAppErrorExtensions } from '@repo/shared';

/**
 * Pulls the field-level validation errors out of an Apollo error.
 *
 * Reads the shared `{ code, fieldErrors }` contract from each GraphQL error's
 * `extensions`. Returns an empty array for anything that isn't a GraphQL error
 * or doesn't carry field errors, so callers can treat "no fields" uniformly.
 */
export function getAppErrorFieldErrors(error: unknown): FieldError[] {
  if (!(error instanceof CombinedGraphQLErrors)) {
    return [];
  }

  return error.errors.flatMap(
    (graphQLError) => parseAppErrorExtensions(graphQLError.extensions)?.fieldErrors ?? [],
  );
}
