import { z } from 'zod';

export const editSubjectSchema = z.object({
  id: z.number(),
  course_code: z.string().min(1, 'Must enter course code.'),
  name: z.string().min(1, 'Must enter course name.')
});

export type EditSubjectSchema = typeof editSubjectSchema;
