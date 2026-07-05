import { type PipeTransform } from '@nestjs/common';
import { AppError } from '@repo/shared';
import { z } from 'zod';

class ZodValidationPipe<T extends z.ZodType> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.infer<T> {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw AppError.zod(result.error);
    }
    return result.data;
  }
}

export function createZodValidationPipe<T extends z.ZodType>(schema: T) {
  return new ZodValidationPipe(schema);
}
