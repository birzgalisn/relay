import { schemaResolver, useForm, type UseFormInput, type UseFormReturnType } from '@mantine/form';
import type { z } from 'zod';

import { getAppErrorFieldErrors } from '../util/get-app-error-field-errors';
import { type ErrorOptions, useError } from './use-error';

/** Form schemas are always objects, so field paths map onto form keys. */
type FormSchema = z.ZodType<Record<string, unknown>, Record<string, unknown>>;

export type AppForm<Schema extends FormSchema> = UseFormReturnType<
  z.input<Schema>,
  z.output<Schema>
> & {
  /**
   * Maps a backend error onto the form's fields (via the shared `fieldErrors`
   * contract) and falls back to a toast for anything not tied to a field.
   */
  handleError: (error: unknown, options: ErrorOptions) => void;
};

/**
 * A Mantine form with validation and backend-error handling built in.
 *
 * Pass the Zod schema once and it drives both client validation and the
 * submit-time transform; the returned form also carries `handleError`, bound to
 * this exact form instance. This removes the fragile "wire `useForm` and a
 * separate error mapper together" step, so every form behaves consistently.
 *
 * @example
 * const form = useAppForm(createPostFormSchema, {
 *   initialValues: { caption: '', files: [] },
 * });
 * // ...
 * catch (error) {
 *   form.handleError(error, { title: 'Could not publish post' });
 * }
 */
export function useAppForm<Schema extends FormSchema>(
  schema: Schema,
  input: Omit<UseFormInput<z.input<Schema>, z.output<Schema>>, 'validate' | 'transformValues'>,
): AppForm<Schema> {
  const showError = useError();

  const form = useForm<z.input<Schema>, z.output<Schema>>({
    ...input,
    validate: schemaResolver(schema),
    transformValues: (values) => schema.parse(values),
  });

  const handleError = (error: unknown, options: ErrorOptions) => {
    const fieldErrors = getAppErrorFieldErrors(error).filter(({ path }) => path.length > 0);

    if (fieldErrors.length === 0) {
      showError(error, options);
      return;
    }

    for (const { path, message } of fieldErrors) {
      form.setFieldError(path, message);
    }
  };

  return Object.assign(form, { handleError });
}
