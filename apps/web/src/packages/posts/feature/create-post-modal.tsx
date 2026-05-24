import { Modal } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

import { CreatePostForm } from './create-post-form';

export function CreatePostModal() {
  const navigate = useNavigate();

  const goToList = () => {
    void navigate({ to: '/posts', resetScroll: false });
  };

  return (
    <Modal opened onClose={goToList} title="Create post" size="lg" centered closeOnClickOutside>
      <CreatePostForm onPublished={goToList} />
    </Modal>
  );
}
