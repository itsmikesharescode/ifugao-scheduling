import { z } from 'zod';

export const updateEmailSchema = z.object({
  email: z.string().email('Must enter a valid new email.')
});

export type UpdateEmailSchema = typeof updateEmailSchema;
