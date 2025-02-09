import { z } from 'zod';

export const updateProfileSchema = z.object({
  profile: z
    .instanceof(File)
    .refine((file) => file.size <= 2_000_000, 'File must be no larger than 2MB')
});

export type UpdateProfileSchema = typeof updateProfileSchema;
