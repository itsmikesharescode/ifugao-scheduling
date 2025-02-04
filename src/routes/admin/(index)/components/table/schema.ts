import { z } from 'zod';

export const subectPageSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  course_code: z.string(),
  name: z.string()
});

export type SubjectPageSchema = z.output<typeof subectPageSchema>;
