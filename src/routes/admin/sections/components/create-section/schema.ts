import { z } from 'zod';

export const createSectionSchema = z.object({
  name: z.string().min(1, 'Must enter course name.')
});

export type CreateSectionSchema = typeof createSectionSchema;
