import { z } from 'zod';

export const facultySchema = z.object({
  id: z.number(),
  created_at: z.string(),
  first_name: z.string(),
  middle_name: z.string(),
  last_name: z.string(),
  gender: z.string(),
  academic_rank: z.string(),
  birth_date: z.string(),
  status: z.string(),
  departments: z.number().array()
});

export type FacultyPageSchema = z.output<typeof facultySchema>;
