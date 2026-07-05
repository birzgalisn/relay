import { notifications } from '@mantine/notifications';
import { isErrorLike } from '@repo/shared';

export type ErrorOptions = {
  title: string;
  message?: string;
};

export function useError() {
  return (err: unknown, options: ErrorOptions) => {
    const message = isErrorLike(err) ? err.message : undefined;

    notifications.show({
      title: options.title,
      message: message ?? options.message ?? 'Something went wrong',
      color: 'red',
    });
  };
}
