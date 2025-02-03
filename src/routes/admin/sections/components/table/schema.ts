import { z } from 'zod';

export const sectionPageSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  name: z.string()
});

export type SectionPageSchema = z.output<typeof sectionPageSchema>;
