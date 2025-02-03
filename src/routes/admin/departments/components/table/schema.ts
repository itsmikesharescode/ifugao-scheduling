import { z } from 'zod';

export const departmentPageSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  department_code: z.string(),
  name: z.string(),
  color: z.string()
});

export type DepartmentPageSchema = z.output<typeof departmentPageSchema>;
