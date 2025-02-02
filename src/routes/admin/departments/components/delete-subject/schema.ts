import { z } from 'zod';

export const deleteSubjectSchema = z.object({
  id: z.number()
});

export type DeleteSubjectSchema = typeof deleteSubjectSchema;
