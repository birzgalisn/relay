import { useMutation } from '@apollo/client/react';
import { Box, Button, Group, Stack, Text, Textarea } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, type FileWithPath } from '@mantine/dropzone';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  createPostFormSchema,
  pluralize,
  POST_FILE_MAX_UPLOAD_BYTES,
  POST_FILE_MAX_UPLOAD_MIB,
  POST_MAX_FILE_COUNT,
  type CreatePostFormValues,
} from '@repo/shared';
import { useMemo, useState } from 'react';

import { useClosePostsModal } from '../../../shared/hooks/use-close-posts-modal';
import { useFilePreviewUrls } from '../../../shared/hooks/use-file-preview-urls';
import { useMediaStorage } from '../../../shared/hooks/use-media-storage';
import { MediaGrid } from '../../../shared/ui/media-grid';
import { MediaStorageIndicator } from '../../../shared/ui/media-storage-indicator';
import { isInstanceOfError } from '../../../shared/util/is-instance-of-error';
import { CreatePostDocument } from '../data-access/posts.generated';
import { uploadPostFiles } from '../util/upload-post-files-tus';

export function CreatePostForm() {
  const handleClose = useClosePostsModal();
  const { uploadsBlocked, exceedsFreeSpace } = useMediaStorage();
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
  const pendingBytes = useMemo(() => files.reduce((total, file) => total + file.size, 0), [files]);
  const publishDisabled = uploadsBlocked || exceedsFreeSpace(pendingBytes);

  const imagePreviewUrls = useFilePreviewUrls(files);

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
      handleClose();
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
      <MediaStorageIndicator pendingBytes={pendingBytes} />
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Textarea
            label="Caption"
            description="Optional"
            minRows={3}
            {...form.getInputProps('caption')}
            disabled={busy}
          />

          <div>
            <Text size="sm" fw={500} mb={6}>
              Files
            </Text>
            <Dropzone
              onDrop={dropFiles}
              onReject={(rejections) => {
                const rejectedFileNamesFor = (code: string) =>
                  rejections
                    .filter((r) => r.errors.some((e) => e.code === code))
                    .map((r) => `'${r.file.name}'`)
                    .join(', ');

                const tooMany = rejectedFileNamesFor('too-many-files');
                if (tooMany) {
                  notifications.show({
                    title: 'Too many files',
                    message: `${tooMany} were not added (max ${POST_MAX_FILE_COUNT} ${pluralize(POST_MAX_FILE_COUNT, 'file')})`,
                    color: 'red',
                  });
                }

                const tooLarge = rejectedFileNamesFor('file-too-large');
                if (tooLarge) {
                  notifications.show({
                    title: 'File too large',
                    message: `${tooLarge} must be ${POST_FILE_MAX_UPLOAD_MIB} MiB or smaller`,
                    color: 'red',
                  });
                }
              }}
              accept={IMAGE_MIME_TYPE}
              maxSize={POST_FILE_MAX_UPLOAD_BYTES}
              maxFiles={POST_MAX_FILE_COUNT}
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
            <Button type="submit" loading={busy} disabled={publishDisabled}>
              Publish
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
