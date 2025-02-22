import { z } from 'zod';

const commonFields = {
  code: z.string().min(1, 'Must enter course code.'),
  name: z.string().min(1, 'Must enter course name.'),
  departments: z.array(z.number()).min(1, 'Must select at least one department.')
};

export const createSubSchema = z.object(commonFields);

export const updateSubSchema = z.object(commonFields).extend({
  id: z.number()
});

export const deleteSubSchema = z.object({
  id: z.number()
});

export type CreateSubSchema = typeof createSubSchema;
export type UpdateSubSchema = typeof updateSubSchema;
export type DeleteSubSchema = typeof deleteSubSchema;
