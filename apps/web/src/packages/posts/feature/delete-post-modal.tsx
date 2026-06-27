import { useMutation } from '@apollo/client/react';
import { Button, Group, Modal, Skeleton, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { useClosePostsModal } from '../../../shared/hooks/use-close-posts-modal';
import { DeletePostDocument, type PostQuery } from '../data-access/posts.generated';
import { POST_MODAL_PROPS } from '../util/modal-props';

export type DeletePostModalProps = {
  /** Post query still in flight (route loader). */
  pending?: boolean;
  post?: PostQuery['post'] | null;
};

export function DeletePostModal({ pending = false, post }: DeletePostModalProps) {
  const handleClose = useClosePostsModal();
  const [deletePost, { loading: deleting }] = useMutation(DeletePostDocument);

  const captionLabel = post?.caption?.trim() || 'Untitled';
  const showPrimaryPrompt = pending || !!post;

  const handleConfirmDelete = async () => {
    if (!post) {
      return;
    }

    try {
      await deletePost({
        variables: { id: post.id },
      });
      handleClose();
    } catch {
      notifications.show({
        message: 'Could not delete post',
        color: 'red',
      });
    }
  };

  return (
    <Modal opened onClose={handleClose} title="Delete post?" {...POST_MODAL_PROPS}>
      <Stack gap="md">
        <Text size="sm" component="div">
          {showPrimaryPrompt ? (
            <>
              Remove{' '}
              {pending ? (
                <Skeleton
                  height={16}
                  radius="sm"
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'text-bottom',
                    width: 'min(12rem, 55%)',
                  }}
                />
              ) : (
                <Text component="span" fw={700} inherit>
                  {captionLabel}
                </Text>
              )}{' '}
              and its files from the database?
            </>
          ) : (
            'This post could not be found. It may have already been deleted.'
          )}
        </Text>

        {showPrimaryPrompt ? (
          <Text size="xs" c="dimmed" component="div">
            {pending ? (
              <Skeleton
                height={12}
                radius="sm"
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  width: 'min(24rem, 100%)',
                }}
              />
            ) : (
              'Uploaded media files are removed from disk when the post is deleted.'
            )}
          </Text>
        ) : null}

        <Group justify="flex-end">
          <Button variant="default" onClick={handleClose} disabled={deleting}>
            {pending || post ? 'Cancel' : 'Back to posts'}
          </Button>
          {!pending && post ? (
            <Button color="red" loading={deleting} onClick={() => void handleConfirmDelete()}>
              Delete
            </Button>
          ) : null}
        </Group>
      </Stack>
    </Modal>
  );
}
