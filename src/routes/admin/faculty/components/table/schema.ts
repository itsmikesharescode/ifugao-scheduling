import { z } from 'zod';

export const facultySchema = z.object({
  id: z.number(),
  created_at: z.string(),
  firstname: z.string(),
  middlename: z.string(),
  lastname: z.string(),
  gender: z.string(),
  academic_rank: z.string(),
  department_id: z.number(),
  department_code: z.string(),
  status: z.string(),
  birth_date: z.string()
});

export type FacultyPageSchema = z.output<typeof facultySchema>;
