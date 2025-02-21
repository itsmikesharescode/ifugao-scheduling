import { z } from 'zod';

const commonFields = {
  name: z.string().min(1, 'Must enter course name.'),
  departments: z.array(z.number()).min(1, 'Must select at least one department.')
};

export const createSecSchema = z.object(commonFields);

export const updateSecSchema = z.object(commonFields).extend({
  id: z.number()
});

export const deleteSecSchema = z.object({
  id: z.number()
});

export type CreateSecSchema = typeof createSecSchema;
export type UpdateSecSchema = typeof updateSecSchema;
export type DeleteSecSchema = typeof deleteSecSchema;
