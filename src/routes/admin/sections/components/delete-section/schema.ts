import { z } from 'zod';

export const deleteSectionSchema = z.object({
  id: z.number()
});

export type DeleteSectionSchema = typeof deleteSectionSchema;
