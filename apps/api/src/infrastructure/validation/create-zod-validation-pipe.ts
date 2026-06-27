import { BadRequestException, type PipeTransform } from '@nestjs/common';
import { z } from 'zod';

import { formatZodErrorMessage } from './format-zod-error-message';

class ZodValidationPipe<T extends z.ZodType> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.infer<T> {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(formatZodErrorMessage(result.error));
    }
    return result.data;
  }
}

export function createZodValidationPipe<T extends z.ZodType>(schema: T) {
  return new ZodValidationPipe(schema);
}
