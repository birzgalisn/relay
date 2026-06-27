import type { ModalProps } from '@mantine/core';

export const POST_MODAL_PROPS = {
  centered: true,
  closeOnClickOutside: true,
  lockScroll: false,
  transitionProps: { duration: 0 },
} satisfies Partial<ModalProps>;
