import { z } from 'zod';

export const baseSchema = {
  department_code: z.string().min(1, 'Must enter department code.'),
  name: z.string().min(1, 'Must enter department name.'),
  color: z.string().min(1, 'Must choose department color.')
};

export const createDepSchema = z.object(baseSchema);

export const updateDepSchema = z.object(baseSchema).extend({
  id: z.number()
});

export const deleteDepSchema = z.object({
  id: z.number()
});

export type CreateDepSchema = typeof createDepSchema;
export type UpdateDepSchema = typeof updateDepSchema;
export type DeleteDepSchema = typeof deleteDepSchema;
