import { z } from 'zod';

export const updateProfileSchema = z.object({
  profile: z.any().refine((val) => val instanceof File || val instanceof Blob, {
    message: 'Must be a valid photo'
  })
});

export type UpdateProfileSchema = typeof updateProfileSchema;
