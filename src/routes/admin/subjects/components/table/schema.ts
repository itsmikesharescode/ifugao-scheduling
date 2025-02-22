import { z } from 'zod';

export const subectPageSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  code: z.string(),
  name: z.string(),
  departments: z.number().array()
});

export type SubjectPageSchema = z.output<typeof subectPageSchema>;
