import type { ModalProps } from '@mantine/core';

export const postModalProps = {
  centered: true,
  closeOnClickOutside: true,
  lockScroll: false,
  transitionProps: { duration: 0 },
} satisfies Partial<ModalProps>;
