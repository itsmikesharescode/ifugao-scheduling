import { z } from 'zod';

export const createSubjectSchema = z.object({
  course_code: z.string().min(1, 'Must enter course code.'),
  name: z.string().min(1, 'Must enter course name.')
});

export type CreateSubjectSchema = typeof createSubjectSchema;
