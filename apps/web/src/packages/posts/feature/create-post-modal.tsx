import { Modal } from '@mantine/core';

import { useClosePostsModal } from '../../../shared/hooks/use-close-posts-modal';
import { POST_MODAL_PROPS } from '../util/modal-props';
import { CreatePostForm } from './create-post-form';

export function CreatePostModal() {
  const handleClose = useClosePostsModal();

  return (
    <Modal opened onClose={handleClose} title="Create post" size="lg" {...POST_MODAL_PROPS}>
      <CreatePostForm />
    </Modal>
  );
}
