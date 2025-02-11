import { z } from 'zod';

export const baseSchema = {
  department_code: z.string().min(1, 'Must enter department code.'),
  name: z.string().min(1, 'Must enter department name.'),
  color: z.string().min(1, 'Must choose department color.')
};

export const createDepartmentSchema = z.object(baseSchema);

export const editDepartmentSchema = z.object(baseSchema).extend({
  id: z.number()
});

export const deleteDepartmentSchema = z.object({
  id: z.number()
});

export type CreateDepartmentSchema = typeof createDepartmentSchema;
export type EditDepartmentSchema = typeof editDepartmentSchema;
export type DeleteDepartmentSchema = typeof deleteDepartmentSchema;
