import { z } from 'zod';

export const departmentPageSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  code: z.string(),
  name: z.string(),
  color: z.string()
});

export type DepartmentPageSchema = z.output<typeof departmentPageSchema>;
