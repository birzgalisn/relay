import { Modal } from '@mantine/core';

import { useClosePostsModal } from '../../../shared/hooks/use-close-posts-modal';
import { postModalProps } from '../util/modal-props';
import { CreatePostForm } from './create-post-form';

export function CreatePostModal() {
  const handleClose = useClosePostsModal();

  return (
    <Modal opened onClose={handleClose} title="Create post" size="lg" {...postModalProps}>
      <CreatePostForm />
    </Modal>
  );
}
