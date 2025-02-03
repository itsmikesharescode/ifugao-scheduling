import { z } from 'zod';

export const editSectionSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Must enter course name.')
});

export type EditSectionSchema = typeof editSectionSchema;
