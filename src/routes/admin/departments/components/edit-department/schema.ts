import { z } from 'zod';

export const editDepartmentSchema = z.object({
  id: z.number(),
  department_code: z.string().min(1, 'Must enter department code.'),
  name: z.string().min(1, 'Must enter department name.'),
  color: z.string().min(1, 'Must choose department color.')
});

export type EditDepartmentSchema = typeof editDepartmentSchema;
