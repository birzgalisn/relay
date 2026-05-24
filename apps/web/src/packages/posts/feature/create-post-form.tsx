import { useApolloClient, useMutation } from '@apollo/client/react';
import { Box, Button, Group, Stack, Text, Textarea } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, type FileWithPath } from '@mantine/dropzone';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';

import { MediaGrid } from '../../../shared/ui/media-grid';
import { isInstanceOfError } from '../../../shared/util/is-instance-of-error';
import { CreatePostDocument, PostsDocument } from '../data-access/posts.generated';
import { createPostFormSchema, type CreatePostFormValues } from '../util/create-post-form-schema';
import { uploadPostFiles } from '../util/upload-post-files-tus';

export type CreatePostFormProps = {
  onPublished: () => void;
};

export function CreatePostForm({ onPublished }: CreatePostFormProps) {
  const client = useApolloClient();
  const [busy, setBusy] = useState(false);
  /** Per-file upload percent while publishing; `null` when idle. */
  const [fileUploadPct, setFileUploadPct] = useState<number[] | null>(null);

  const [createPost] = useMutation(CreatePostDocument);

  const form = useForm<CreatePostFormValues>({
    initialValues: {
      caption: '',
      files: [],
    },
    validate: schemaResolver(createPostFormSchema),
    transformValues: (values) => createPostFormSchema.parse(values),
  });

  const files = form.values.files;

  const imagePreviewUrls = files.map((file) =>
    file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
  );

  useEffect(() => {
    return () => {
      for (const url of imagePreviewUrls) {
        if (url) {
          URL.revokeObjectURL(url);
        }
      }
    };
  }, [imagePreviewUrls]);

  const dropFiles = (added: FileWithPath[]) => {
    form.setFieldValue('files', [...form.values.files, ...added]);
    form.clearFieldError('files');
  };

  const removeFile = (index: number) => {
    const next = form.values.files.filter((_, i) => i !== index);
    form.setFieldValue('files', next);
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setBusy(true);
    try {
      const result = await createPost({
        variables: {
          input: {
            caption: values.caption.length > 0 ? values.caption : null,
            fileCount: values.files.length,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const postId = result.data?.createPost.id;
      if (!postId) {
        throw new Error('Create post returned no id');
      }

      setFileUploadPct(values.files.map(() => 0));
      await uploadPostFiles(postId, values.files, ({ fileIndex, bytesUploaded, bytesTotal }) => {
        const file = values.files[fileIndex];
        const total = bytesTotal > 0 ? bytesTotal : (file?.size ?? 0);
        const pct = total > 0 ? Math.min(100, Math.round((bytesUploaded / total) * 100)) : 0;
        setFileUploadPct((prev) => {
          if (prev == null) {
            return prev;
          }
          const next = [...prev];
          if (fileIndex >= 0 && fileIndex < next.length) {
            next[fileIndex] = pct;
          }
          return next;
        });
      });
      await client.query({
        query: PostsDocument,
        variables: { cursor: null },
        fetchPolicy: 'network-only',
      });
      onPublished();
    } catch (e) {
      notifications.show({
        title: 'Could not publish post',
        message: isInstanceOfError(e) ? e.message : 'Something went wrong',
        color: 'red',
      });
    } finally {
      setFileUploadPct(null);
      setBusy(false);
    }
  });

  return (
    <Stack gap="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Textarea
            label="Caption"
            description="Optional"
            minRows={3}
            {...form.getInputProps('caption')}
          />

          <div>
            <Text size="sm" fw={500} mb={6}>
              Files
            </Text>
            <Dropzone
              onDrop={dropFiles}
              accept={IMAGE_MIME_TYPE}
              maxSize={20 * 1024 ** 2}
              disabled={busy}
            >
              <Text ta="center">Drop files here or click to select</Text>
            </Dropzone>
            {form.errors.files ? (
              <Text size="sm" c="red" mt={6}>
                {form.errors.files}
              </Text>
            ) : null}
            {files.length > 0 ? (
              <Box mt="sm">
                <MediaGrid
                  busy={busy}
                  items={files.map((file, index) => ({
                    key: `${file.name}-${index}`,
                    src: imagePreviewUrls[index] ?? '',
                    alt: file.name,
                    uploadProgress: fileUploadPct?.[index],
                  }))}
                  onRemove={removeFile}
                />
              </Box>
            ) : null}
          </div>

          <Group justify="flex-end">
            <Button type="submit" loading={busy}>
              Publish
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
