import { z } from 'zod';

export const createDepartmentSchema = z.object({
  department_code: z.string().min(1, 'Must enter department code.'),
  name: z.string().min(1, 'Must enter department name.'),
  color: z.string().min(1, 'Must choose department color.')
});

export type CreateDepartmentSchema = typeof createDepartmentSchema;
