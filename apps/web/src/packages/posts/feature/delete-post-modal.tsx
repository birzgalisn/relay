import { useMutation } from '@apollo/client/react';
import { Button, Group, Modal, Skeleton, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from '@tanstack/react-router';

import { DeletePostDocument, PostsDocument, type PostQuery } from '../data-access/posts.generated';

export type DeletePostModalProps = {
  /** Route loader is still running — inline skeleton where the title will appear. */
  pending?: boolean;
  post?: PostQuery['post'];
};

export function DeletePostModal({ pending = false, post }: DeletePostModalProps) {
  const navigate = useNavigate();

  const [deletePost, { loading: deleting }] = useMutation(DeletePostDocument);

  const goToList = () => {
    void navigate({ to: '/posts', resetScroll: false });
  };

  const handleConfirmDelete = async () => {
    if (!post) {
      return;
    }

    try {
      await deletePost({
        variables: { id: post.id },
        refetchQueries: [
          {
            query: PostsDocument,
            variables: { cursor: null },
          },
        ],
      });
      goToList();
    } catch {
      notifications.show({
        message: 'Could not delete post',
        color: 'red',
      });
    }
  };

  const captionLabel = post?.caption || 'Untitled';
  const showPrimaryPrompt = pending || !!post;

  return (
    <Modal opened onClose={goToList} title="Delete post?" centered closeOnClickOutside>
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
          <Button variant="default" onClick={goToList} disabled={deleting}>
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
